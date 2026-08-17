# DevVault — Personal Knowledge Agent

A CLI-based personal knowledge assistant powered by MCP (Model Context Protocol).
Store code snippets, notes, and learnings, then retrieve them with natural language.

## How It Works

DevVault runs as an MCP server used by Claude Code.

You -> Claude Code -> MCP Protocol -> DevVault Server -> SQLite Database

## Quick Start

```bash
# Install dependencies
npm install

# Run local checks
npm run typecheck
npm run build

# Start MCP server locally
npm run dev

# Start Claude Code with DevVault config
claude --mcp-config mcp-server.json
```

## Usage Examples

- "Save this: To reset a PostgreSQL sequence, use ALTER SEQUENCE seq RESTART WITH 1. Tags: postgres, sql"
- "What do I know about React hooks?"
- "Find that thing I saved about cleaning up subscriptions"
- "Show me all my backend notes"
- "What did I learn this week?"
- "Give me stats on my knowledge base"

## Architecture

```text
Claude Code (Client)
    -> MCP over stdio
src/mcp-server/server.ts (bootstrap and lifecycle)
    -> tools/ (one module per MCP tool)
    -> resources/ (MCP resource registrations)
    -> validators.ts (Zod input schemas)
    -> database.ts (SQLite access and migrations)
```

The database is created at `data/knowledge.db` on first startup. Tool and resource
registrations are kept separate from process lifecycle code so each surface can be
tested and extended independently.

## Search Behavior

DevVault searches across content, tags, and category.
Search responses return total matches and include up to five results.

## Security

- All tool inputs are validated with Zod schemas.
- Content and query limits are enforced.
- Delete operations require explicit confirmation text.


