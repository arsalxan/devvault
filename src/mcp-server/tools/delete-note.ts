import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { deleteNote, getNoteById } from '../database.js';
import { DeleteNoteSchema } from '../validators.js';

export function registerDeleteNoteTool(server: McpServer): void {
  server.registerTool(
    'delete_note',
    {
      description: 'Delete a note by ID. Requires confirmText: DELETE_NOTE.',
      inputSchema: DeleteNoteSchema,
    },
    async (params) => {
      const { id } = params;

      const existing = getNoteById(id);
      if (!existing) {
        return {
          content: [{
            type: 'text',
            text: `❌ Note with ID ${id} not found. Use list_notes or search_notes to find the correct ID.`,
          }],
        };
      }

      const deleted = deleteNote(id);

      return {
        content: [{
          type: 'text',
          text: deleted
            ? `🗑️ Deleted note [ID: ${id}]: "${existing.content.substring(0, 50)}..."`
            : `❌ Failed to delete note ${id}. Please try again.`,
        }],
      };
    }
  );
}
