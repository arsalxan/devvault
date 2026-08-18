import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { readFileSync, statSync } from 'fs';
import { addNote, searchNotes } from '../database';
import { ImportFileSchema } from '../validators';
import { inferCategory } from '../../config/settings';
import { SETTINGS } from '../../config/settings';
import { calculateSimilarity } from '../utils/similarity';

const MAX_CHUNK_SIZE = 5300; // 5000 content + 300 overhead
const DUPLICATE_THRESHOLD = 0.90;

interface ParsedEntry {
  number: number;
  content: string;
  tags: string[];
  rawText: string;
}

interface ParseResult {
  success: boolean;
  entry?: ParsedEntry;
  error?: string;
}

interface ImportSummary {
  imported: Array<{ entryNumber: number; noteId: number }>;
  duplicates: Array<{ entryNumber: number; similarTo: number; similarity: number }>;
  oversized: Array<{ entryNumber: number; size: number }>;
  parseFailures: Array<{ entryNumber: number; rawText: string; reason: string }>;
  needsConfirmation: Array<{ entryNumber: number; suggestedContent: string; suggestedTags: string[] }>;
}

function splitFileIntoChunks(content: string): string[] {
  if (content.includes('---')) {
    return content.split('---').map((chunk) => chunk.trim()).filter((chunk) => chunk.length > 0);
  }

  const paragraphChunks = content.split(/\n\s*\n/).map((chunk) => chunk.trim()).filter((chunk) => chunk.length > 0);

  if (paragraphChunks.length > 1) {
    return paragraphChunks;
  }

  return [content.trim()];
}

function parseStructuredEntry(rawText: string, index: number): ParseResult {
  const lines = rawText.split('\n');

  if (lines.length === 0) {
    return { success: false, error: 'Empty entry' };
  }

  const firstLine = lines[0].trim();
  const numberMatch = firstLine.match(/^(\d+)\.$/);

  if (!numberMatch) {
    return { success: false, error: 'Missing entry number (expected format: "1.")' };
  }

  const entryNumber = parseInt(numberMatch[1], 10);

  const tagsLineIndex = lines.findIndex((line) => line.trim().startsWith('tags:'));

  if (tagsLineIndex === -1) {
    return { success: false, error: 'Missing "tags:" line' };
  }

  const contentLines = lines.slice(1, tagsLineIndex);
  const content = contentLines.join('\n').trim();

  if (content.length === 0) {
    return { success: false, error: 'Empty content' };
  }

  if (content.length > SETTINGS.MAX_CONTENT_LENGTH) {
    return { success: false, error: `Content exceeds ${SETTINGS.MAX_CONTENT_LENGTH} characters` };
  }

  const tagsLine = lines[tagsLineIndex].trim();
  const tagsString = tagsLine.replace(/^tags:\s*/, '').trim();

  if (tagsString.length === 0) {
    return { success: false, error: 'No tags provided after "tags:"' };
  }

  const tags = tagsString.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);

  if (tags.length === 0) {
    return { success: false, error: 'No valid tags found' };
  }

  if (tags.length > SETTINGS.MAX_TAGS_PER_NOTE) {
    return { success: false, error: `Too many tags (max: ${SETTINGS.MAX_TAGS_PER_NOTE})` };
  }

  for (const tag of tags) {
    if (tag.length > SETTINGS.MAX_TAG_LENGTH) {
      return { success: false, error: `Tag "${tag}" exceeds ${SETTINGS.MAX_TAG_LENGTH} characters` };
    }
  }

  return {
    success: true,
    entry: {
      number: entryNumber,
      content,
      tags,
      rawText,
    },
  };
}

async function checkForDuplicates(content: string): Promise<{ isDuplicate: boolean; noteId?: number; similarity?: number }> {
  const searchResults = await searchNotes(content.slice(0, 100), 10);

  for (const existingNote of searchResults.notes) {
    const similarity = calculateSimilarity(
      content.toLowerCase().trim(),
      existingNote.content.toLowerCase().trim()
    );

    if (similarity >= DUPLICATE_THRESHOLD) {
      return { isDuplicate: true, noteId: existingNote.id, similarity };
    }
  }

  return { isDuplicate: false };
}

export function registerImportFileTool(server: McpServer): void {
  server.registerTool(
    'import_file',
    {
      description: 'Import a .txt or .md file with numbered entries. Each entry should follow the format: "NUMBER.\\ncontent\\ntags: tag1, tag2\\n---". LLM fallback available for malformed entries with user confirmation.',
      inputSchema: ImportFileSchema,
    },
    async (params) => {
      const { file_path } = params;

      try {
        const stats = statSync(file_path);
        if (stats.size > SETTINGS.MAX_IMPORT_FILE_SIZE) {
          return {
            content: [{
              type: 'text',
              text: `❌ File too large: ${stats.size} bytes (limit: ${SETTINGS.MAX_IMPORT_FILE_SIZE} bytes / ${Math.round(SETTINGS.MAX_IMPORT_FILE_SIZE / 1024)}KB)\n\nPlease split the file into smaller parts.`,
            }],
          };
        }

        const fileContent = readFileSync(file_path, 'utf-8');
        const chunks = splitFileIntoChunks(fileContent);

        const summary: ImportSummary = {
          imported: [],
          duplicates: [],
          oversized: [],
          parseFailures: [],
          needsConfirmation: [],
        };

        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];

          if (chunk.length > MAX_CHUNK_SIZE) {
            summary.oversized.push({
              entryNumber: i + 1,
              size: chunk.length,
            });
            continue;
          }

          const parseResult = parseStructuredEntry(chunk, i);

          if (!parseResult.success) {
            summary.parseFailures.push({
              entryNumber: i + 1,
              rawText: chunk,
              reason: parseResult.error || 'Unknown parse error',
            });
            continue;
          }

          const entry = parseResult.entry!;

          const duplicateCheck = await checkForDuplicates(entry.content);

          if (duplicateCheck.isDuplicate) {
            summary.duplicates.push({
              entryNumber: entry.number,
              similarTo: duplicateCheck.noteId!,
              similarity: duplicateCheck.similarity!,
            });
            continue;
          }

          const tagsString = entry.tags.join(', ');
          const category = inferCategory(entry.content, entry.tags);
          const note = addNote(entry.content, tagsString, category);

          summary.imported.push({
            entryNumber: entry.number,
            noteId: note.id,
          });
        }

        let resultText = '';

        if (summary.imported.length > 0) {
          resultText += `✅ Imported ${summary.imported.length} note${summary.imported.length !== 1 ? 's' : ''}:\n`;
          for (const item of summary.imported) {
            resultText += `  - Entry #${item.entryNumber} → Note ID ${item.noteId}\n`;
          }
          resultText += '\n';
        }

        if (summary.oversized.length > 0) {
          resultText += `❌ Cannot process - Entry too large:\n\n`;
          for (const item of summary.oversized) {
            resultText += `Entry #${item.entryNumber} is ${item.size} characters (max: ${MAX_CHUNK_SIZE})\n`;
          }
          resultText += `\nPlease edit the file and split oversized entries into smaller parts, then re-import.\n\n`;
        }

        if (summary.parseFailures.length > 0) {
          resultText += `⚠️ Failed to parse ${summary.parseFailures.length} entr${summary.parseFailures.length !== 1 ? 'ies' : 'y'}:\n`;
          for (const failure of summary.parseFailures) {
            resultText += `  - Entry #${failure.entryNumber}: ${failure.reason}\n`;
          }
          resultText += `\nExpected format:\n`;
          resultText += `1.\nYour content here\ntags: tag1, tag2\n---\n\n`;
          resultText += `Note: LLM fallback for malformed entries will be available in a future update.\n\n`;
        }

        if (summary.duplicates.length > 0) {
          resultText += `⚠️ Skipped ${summary.duplicates.length} duplicate${summary.duplicates.length !== 1 ? 's' : ''}:\n`;
          for (const dup of summary.duplicates) {
            const percentage = Math.round(dup.similarity * 100);
            resultText += `  - Entry #${dup.entryNumber}: ${percentage}% similar to note #${dup.similarTo}\n`;
          }
        }

        if (resultText.length === 0) {
          resultText = '⚠️ No entries were processed. Please check the file format.';
        }

        return {
          content: [{ type: 'text', text: resultText.trim() }],
        };
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return {
            content: [{
              type: 'text',
              text: `❌ File not found: ${file_path}\n\nPlease check:\n- The path is correct\n- The file exists\n- You have permission to read it`,
            }],
          };
        } else if ((error as NodeJS.ErrnoException).code === 'EACCES') {
          return {
            content: [{
              type: 'text',
              text: `❌ Permission denied: ${file_path}\n\nPlease check file permissions and try again.`,
            }],
          };
        } else {
          return {
            content: [{
              type: 'text',
              text: `❌ Error importing file: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }],
          };
        }
      }
    }
  );
}
