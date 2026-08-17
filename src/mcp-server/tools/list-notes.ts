import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { listNotes } from '../database';
import { ListNotesSchema } from '../validators';

export function registerListNotesTool(server: McpServer): void {
  server.registerTool(
    'list_notes',
    {
      description: 'List notes with pagination, optionally filtered by category',
      inputSchema: ListNotesSchema,
    },
    async (params) => {
      const { page, limit, category } = params;
      const { notes, total } = listNotes(page, limit, category);

      if (notes.length === 0) {
        return {
          content: [{
            type: 'text',
            text: category ? `📋 No notes found in category "${category}".` : '📋 Your knowledge base is empty. Start adding notes!',
          }],
        };
      }

      const totalPages = Math.ceil(total / limit);
      const formatted = notes
        .map((note) => `[ID: ${note.id}] (${note.category}) [${note.tags}] — ${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}`)
        .join('\n');

      return {
        content: [{
          type: 'text',
          text: `📋 Notes (page ${page} of ${totalPages}, total: ${total})${category ? ` [category: ${category}]` : ''}:\n\n${formatted}`,
        }],
      };
    }
  );
}
