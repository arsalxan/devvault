import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { addNote } from '../database';
import { AddNoteSchema } from '../validators';
import { inferCategory } from '../../config/settings';

export function registerAddNoteTool(server: McpServer): void {
  server.registerTool(
    'add_note',
    {
      description: 'Save a new note/snippet to your knowledge base',
      inputSchema: AddNoteSchema,
    },
    async (params) => {
      const { content, tags } = params;
      const tagsString = tags.join(', ');
      const category = inferCategory(content, tags);
      const note = addNote(content, tagsString, category);

      return {
        content: [{
          type: 'text',
          text: `✅ Note saved!\n📝 ID: ${note.id}\n🏷️ Tags: ${note.tags}\n📁 Category: ${note.category}\n📅 Created: ${note.created_at}`,
        }],
      };
    }
  );
}
