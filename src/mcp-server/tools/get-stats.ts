import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getStats } from '../database.js';

export function registerGetStatsTool(server: McpServer): void {
  server.registerTool(
    'get_stats',
    {
      description: 'Show statistics about your knowledge base',
    },
    async () => {
      const stats = getStats();

      const categoryList = Object.entries(stats.categories)
        .map(([cat, count]) => `  ${cat}: ${count}`)
        .join('\n');

      const tagList = stats.topTags
        .map((t) => `  ${t.tag} (${t.count})`)
        .join('\n');

      return {
        content: [{
          type: 'text',
          text: `📊 Knowledge Base Stats:\n\n📝 Total notes: ${stats.total}\n\n📁 Categories:\n${categoryList || '  (none yet)'}\n\n🏷️ Top tags:\n${tagList || '  (none yet)'}`,
        }],
      };
    }
  );
}
