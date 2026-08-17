import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { searchNotes } from '../database';
import { SearchNotesSchema } from '../validators';

export function registerSearchNotesTool(server: McpServer): void {
  server.registerTool(
    'search_notes',
    {
      description: 'Search your knowledge base by keyword, tag, or topic',
      inputSchema: SearchNotesSchema,
    },
    async (params) => {
      const { query, limit } = params;
      const { notes, total } = searchNotes(query, limit);

      if (total === 0) {
        return {
          content: [{
            type: 'text',
            text: `🔍 No notes found for "${query}".\n💡 Try a broader search term, or check available tags with the knowledge://tags resource.`,
          }],
        };
      }

      const formatted = notes
        .map((note) => `[ID: ${note.id}] (${note.category}) [${note.tags}]\n${note.content}\n📅 ${note.created_at}`)
        .join('\n---\n');

      return {
        content: [{
          type: 'text',
          text: `🔍 Found ${total} result(s) for "${query}" (showing ${notes.length}):\n\n${formatted}`,
        }],
      };
    }
  );
}
