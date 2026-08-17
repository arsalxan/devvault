import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getStats, listNotes } from '../database';

export function registerResources(server: McpServer): void {
  server.registerResource(
    'knowledge://tags',
    'knowledge://tags',
    {
      description: 'List all tags currently in the knowledge base',
      mimeType: 'text/plain',
    },
    async () => {
      const stats = getStats();
      const tags = stats.topTags.map((t) => t.tag).join(', ');
      return {
        contents: [{
          uri: 'knowledge://tags',
          text: tags || 'No tags yet. Add some notes first!',
          mimeType: 'text/plain',
        }],
      };
    }
  );

  server.registerResource(
    'knowledge://recent',
    'knowledge://recent',
    {
      description: 'Get the most recent notes from the knowledge base',
      mimeType: 'text/plain',
    },
    async () => {
      const { notes } = listNotes(1, 10);
      const formatted = notes
        .map((note) => `[ID: ${note.id}] (${note.category}) [${note.tags}] — ${note.content.substring(0, 100)}`)
        .join('\n');
      return {
        contents: [{
          uri: 'knowledge://recent',
          text: formatted || 'No notes yet.',
          mimeType: 'text/plain',
        }],
      };
    }
  );
}
