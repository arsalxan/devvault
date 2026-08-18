# DevVault Quick Reference

Fast lookup for common operations.

---

## 🚀 Installation (One-Time Setup)

```bash
npm install
npm run build
```

Add to `~/.claude/config/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "devvault": {
      "command": "node",
      "args": ["/absolute/path/to/devvault/dist/mcp-server/server.js"]
    }
  }
}
```

Restart Claude Code.

---

## 💬 Common Commands

### Save a Note
```
"Save this: [content]. Tags: [tag1, tag2]"
"Remember: [content]. Tags: [tag1, tag2]"
```

### Search Notes
```
"What do I know about [topic]?"
"Find my notes on [topic]"
"Show me [topic] notes"
```

### List Notes
```
"Show me all my notes"
"List my [category] notes"
"Show recent notes"
```

### Get Statistics
```
"Show my knowledge stats"
"How many notes do I have?"
"What are my top tags?"
```

### Import File
```
"Import notes from [/path/to/file.txt]"
"Load notes from [file-path]"
```

### Delete Note
```
"Delete note [ID]"
```

---

## 📝 Import File Format

```
1.
Your content here
Multiple lines OK (max 5000 chars)
tags: tag1, tag2, tag3
---
2.
More content
tags: tag4, tag5
---
```

**Key points:**
- Start with `NUMBER.`
- End tags line with `tags: ...`
- Separate with `---`
- Max 5300 chars per entry
- Max 50KB file size

---

## 🏷️ Auto-Categories

| Category | Keywords |
|----------|----------|
| `frontend` | react, vue, css, html, ui |
| `backend` | api, server, node, express |
| `database` | sql, postgres, mysql, query |
| `devops` | docker, ci/cd, deploy, aws |
| `security` | auth, jwt, encryption, xss |
| `testing` | jest, test, mock, coverage |
| `architecture` | design pattern, microservice |
| `language` | javascript, python, syntax |
| `tool` | git, npm, vscode, cli |
| `general` | everything else |

---

## 📊 Limits

| Item | Limit |
|------|-------|
| Content | 5,000 chars |
| Tags per note | 10 |
| Tag length | 30 chars |
| Search results | 5 notes |
| File import | 50 KB |
| Entry size | 5,300 chars |

---

## 🔍 Duplicate Detection

- 90% similarity threshold
- Compares content only
- Case-insensitive
- Reports matching note ID

---

## 🛠️ Development

```bash
# Type check
npm run typecheck

# Build
npm run build

# Test
npm test

# Dev server
npm run dev
```

---

## 📁 File Structure

```
devvault/
├── src/
│   ├── mcp-server/
│   │   ├── server.ts          # Entry point
│   │   ├── database.ts        # SQLite ops
│   │   ├── validators.ts      # Zod schemas
│   │   ├── tools/             # MCP tools
│   │   │   ├── add-note.ts
│   │   │   ├── search-notes.ts
│   │   │   ├── list-notes.ts
│   │   │   ├── delete-note.ts
│   │   │   ├── get-stats.ts
│   │   │   └── import-file.ts
│   │   └── utils/
│   │       └── similarity.ts  # Duplicate detection
│   └── config/
│       └── settings.ts        # Configuration
├── data/
│   └── knowledge.db          # SQLite database
├── docs/
│   ├── SETUP.md              # Setup guide
│   ├── IMPORT-FORMAT.md      # Import format details
│   ├── import-example.md     # Example file
│   └── QUICK-REFERENCE.md    # This file
└── tests/                    # Test files
```

---

## 🆘 Troubleshooting

### MCP server not found
- Check absolute path in config
- Run `npm run build`
- Restart Claude Code

### Parse errors on import
- Check file format (see IMPORT-FORMAT.md)
- Verify `tags:` line exists
- Check for `---` separators

### Duplicate skipped
- Content is >90% similar to existing
- Review existing note ID shown
- Edit to add new information

### File too large
- Max 50KB per file
- Split into smaller files
- Or reduce content per entry

---

## 📚 Full Documentation

- **[README.md](../README.md)** — Complete user guide
- **[SETUP.md](./SETUP.md)** — Installation & configuration
- **[IMPORT-FORMAT.md](./IMPORT-FORMAT.md)** — Import file format details
- **[import-example.md](./import-example.md)** — Working example file

---

## 🎯 Quick Tips

✅ Save notes immediately (don't wait)  
✅ Use specific tags for better search  
✅ Review stats weekly  
✅ Bulk import existing notes  
✅ Keep entries focused and concise  
✅ Include examples in notes  
✅ Use meaningful first lines  

---

**Need help? Read the full [README.md](../README.md)**
