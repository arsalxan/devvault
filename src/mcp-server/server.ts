#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { closeDatabase, initDatabase } from './database.js';
import { registerTools } from './tools/index.js';
import { registerResources } from './resources/index.js';

const server = new McpServer({
  name: 'devvault',
  version: '1.1.1',
});

registerTools(server);
registerResources(server);

async function main() {
  initDatabase();

  const shutdown = () => {
    closeDatabase();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('DevVault MCP server running on stdio');
}

main().catch((error) => {
  closeDatabase();
  console.error('Fatal error starting server:', error);
  process.exit(1);
});