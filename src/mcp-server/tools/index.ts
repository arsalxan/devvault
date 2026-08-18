import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAddNoteTool } from './add-note';
import { registerSearchNotesTool } from './search-notes';
import { registerListNotesTool } from './list-notes';
import { registerDeleteNoteTool } from './delete-note';
import { registerGetStatsTool } from './get-stats';
import { registerImportFileTool } from './import-file';

export function registerTools(server: McpServer): void {
  registerAddNoteTool(server);
  registerSearchNotesTool(server);
  registerListNotesTool(server);
  registerDeleteNoteTool(server);
  registerGetStatsTool(server);
  registerImportFileTool(server);
}
