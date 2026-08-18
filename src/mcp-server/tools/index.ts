import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAddNoteTool } from './add-note.js';
import { registerSearchNotesTool } from './search-notes.js';
import { registerListNotesTool } from './list-notes.js';
import { registerDeleteNoteTool } from './delete-note.js';
import { registerGetStatsTool } from './get-stats.js';
import { registerImportFileTool } from './import-file.js';

export function registerTools(server: McpServer): void {
  registerAddNoteTool(server);
  registerSearchNotesTool(server);
  registerListNotesTool(server);
  registerDeleteNoteTool(server);
  registerGetStatsTool(server);
  registerImportFileTool(server);
}
