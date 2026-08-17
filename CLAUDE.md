# DevVault — Personal Knowledge Agent

## What This Project Is
DevVault is an MCP server that provides a personal knowledge management system.
It stores code snippets, notes, and learnings in a local SQLite database and
exposes them via MCP tools for search, retrieval, and organization.

## Architecture
- MCP Server (src/mcp-server/) — exposes tools and resources
- SQLite Database (data/knowledge.db) — stores all notes
- Validation Layer (src/mcp-server/validators.ts) — input security

## MCP Tools Available
- add_note: Save a new note with content and tags
- search_notes: Search by keyword or tag
- list_notes: List notes with pagination
- delete_note: Remove a note by ID (always confirm first)
- get_stats: Show knowledge base statistics

## Rules
- Never delete notes without explicit user confirmation
- Always validate inputs before database operations
- Keep responses concise — summarize large result sets
- When search returns many results, show top 5 and mention total count
- Categorize notes automatically when saving (e.g., frontend, backend, devops, database)

## Code Style
- TypeScript with strict types
- Descriptive variable names
- Error handling on every database operation
- Zod schemas for all input validation