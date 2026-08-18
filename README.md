# DevVault — Personal Knowledge Agent

A CLI-based personal knowledge assistant powered by MCP (Model Context Protocol).
Store code snippets, development notes, and learnings, then retrieve them with natural language through Claude.

## 🎯 What is DevVault?

DevVault is an MCP server that gives Claude Code access to a personal knowledge base. It allows you to:
- 📝 Save code snippets, commands, and learnings
- 🔍 Search your notes with natural language
- 🏷️ Organize with auto-categorization and tags
- 📊 Track your knowledge growth with statistics
- 📥 Bulk import notes from text/markdown files

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd devvault

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Configure Claude Code

Add DevVault to your Claude Code MCP configuration:

**Windows:** `%USERPROFILE%\.claude\config\claude_desktop_config.json`  
**macOS/Linux:** `~/.claude/config/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "devvault": {
      "command": "node",
      "args": ["C:/path/to/devvault/dist/mcp-server/server.js"]
    }
  }
}
```

### 3. Start Using

Restart Claude Code and start saving knowledge:

```
You: "Save this: git reset --hard HEAD~1 reverts to previous commit. Tags: git, revert"
Claude: ✅ Note saved! ID: 1, Category: tool
```

---

## 📚 Available Tools

### `add_note`
Save a single note to your knowledge base.

**Example:**
```
"Save this: useEffect cleanup runs on unmount. Tags: react, hooks, cleanup"
```

**What Claude does:**
- Auto-assigns category (frontend/backend/database/etc.)
- Stores with timestamp
- Returns note ID for future reference

---

### `search_notes`
Search your knowledge base by keyword, tag, or topic.

**Examples:**
```
"What do I know about Docker?"
"Find that thing about JWT tokens"
"Show me my React notes"
```

**Features:**
- Searches across content, tags, and categories
- Returns top 5 matches with total count
- Highlights relevant snippets

---

### `list_notes`
Browse notes with pagination and optional category filtering.

**Examples:**
```
"Show me all my backend notes"
"List my most recent 10 notes"
"What's in my security category?"
```

**Features:**
- Pagination support (10 notes per page by default)
- Filter by category
- Shows total count: "Showing 10 of 47 notes"

---

### `delete_note`
Delete a note by ID with confirmation.

**Example:**
```
"Delete note 42"
```

**Safety:**
- Always shows preview first
- Requires explicit confirmation
- Cannot be undone after confirmation

---

### `get_stats`
View statistics about your knowledge base.

**Example:**
```
"Show me my knowledge stats"
```

**Returns:**
- Total notes count
- Notes per category
- Top 10 most-used tags

---

### `import_file` ⭐ NEW
Bulk import notes from a structured text/markdown file.

**File Format:**
```
1.
git merge combines branches by creating a new commit.
It preserves the complete history of both branches.
tags: git, merge, version-control
---
2.
useEffect cleanup function runs when component unmounts.
Always return cleanup for subscriptions or timers.
tags: react, hooks, cleanup
---
3.
SQL INNER JOIN returns only matching rows from both tables.
tags: sql, database, joins
---
```

**Rules:**
- Each entry starts with `NUMBER.` (e.g., `1.`, `2.`)
- Content can be multi-line (up to 5000 characters)
- Tags line format: `tags: tag1, tag2, tag3`
- Entries separated by `---`

**Example Usage:**
```
"Import notes from C:/Users/me/dev-notes.txt"
```

**Features:**
- ✅ Auto-categorization per entry
- ✅ Duplicate detection (90% similarity threshold)
- ✅ Size validation (max 5300 chars per entry)
- ✅ Detailed error reporting with entry numbers
- ✅ Fallback parsing for double-newline format

**Output:**
```
✅ Imported 5 notes:
  - Entry #1 → Note ID 45
  - Entry #2 → Note ID 46
  - Entry #3 → Note ID 47
  - Entry #4 → Note ID 48
  - Entry #5 → Note ID 49

⚠️ Skipped 1 duplicate:
  - Entry #6: 92% similar to note #23
```

See `docs/import-example.md` for a complete example file.

---

## 🏷️ Auto-Categorization

DevVault automatically assigns categories based on content and tags:

| Category | Examples |
|----------|----------|
| **frontend** | React, Vue, CSS, HTML, UI/UX |
| **backend** | Node.js, APIs, Express, authentication |
| **database** | SQL, PostgreSQL, MongoDB, queries |
| **devops** | Docker, CI/CD, deployment, AWS |
| **security** | Auth, encryption, JWT, CORS |
| **testing** | Jest, unit tests, mocking, TDD |
| **architecture** | Design patterns, system design |
| **language** | JavaScript, TypeScript, Python syntax |
| **tool** | Git, VS Code, npm, CLI tools |
| **general** | Anything that doesn't fit above |

You don't need to specify category — Claude infers it automatically!

---

## 💡 Usage Tips

### Natural Language Queries
```
✅ "What do I know about Docker networking?"
✅ "Find my notes on React hooks cleanup"
✅ "Show me recent backend learnings"
✅ "That git command for undoing commits"
```

### Saving Notes
```
✅ "Remember this: Array.reduce() is powerful for transformations. Tags: javascript, arrays"
✅ "Save: JWT should be in httpOnly cookies, not localStorage. Tags: security, jwt"
```

### Organizing
```
✅ "Show stats" — see your knowledge growth
✅ "List my security notes" — browse by category
✅ "What are my top tags?" — find common topics
```

### Bulk Import
```
✅ "Import from C:/notes/git-commands.txt"
✅ "Load my learning notes from ~/dev-snippets.md"
```

---

## 🗂️ File Import Guide

### Creating Import Files

**Option 1: Structured Format (Recommended)**
```
1.
Your content here
Can be multiple lines
tags: tag1, tag2
---
2.
More content
tags: tag3, tag4
---
```

**Option 2: Paragraph Format (Fallback)**
```
First note content here.

Second note content here.

Third note content here.
```

⚠️ **Paragraph format** requires tags to be added manually after import.

### Size Limits
- Maximum file size: **50KB**
- Maximum content per entry: **5000 characters**
- Maximum entry size (with formatting): **5300 characters**

### Duplicate Detection
DevVault checks for 90% similarity against existing notes:
- `"git merge is useful"` vs `"git merge helps"` → **Duplicate** ❌
- `"git checkout changes branch"` vs `"git checkout reverts files"` → **Different** ✅

### Error Handling
```
❌ Entry #3 is too large: 8,450 characters (max: 5,300)
→ Split the entry into smaller parts

⚠️ Entry #5: Missing "tags:" line
→ Add tags line or fix format

⚠️ Entry #7: 95% similar to note #42
→ Skipped to avoid duplicate
```

---

## 🏗️ Architecture

```
Claude Code (Client)
    ↓ MCP over stdio
src/mcp-server/server.ts (bootstrap)
    ↓
    ├─ tools/ (MCP tools)
    │   ├─ add-note.ts
    │   ├─ search-notes.ts
    │   ├─ list-notes.ts
    │   ├─ delete-note.ts
    │   ├─ get-stats.ts
    │   └─ import-file.ts ⭐
    │
    ├─ validators.ts (Zod schemas)
    ├─ database.ts (SQLite operations)
    └─ utils/
        └─ similarity.ts (duplicate detection)
```

**Database:** SQLite at `data/knowledge.db`  
**Search:** Full-text search across content, tags, categories

---

## 🔒 Security

- ✅ All inputs validated with Zod schemas
- ✅ Content length limits enforced (5000 chars)
- ✅ Tag limits: max 10 tags, 30 chars each
- ✅ Delete requires explicit confirmation
- ✅ File imports: `.txt` and `.md` only
- ✅ Path validation: no `..` (directory traversal blocked)
- ✅ File size limit: 50KB max

---

## 🧪 Development

```bash
# Type checking
npm run typecheck

# Build
npm run build

# Run tests
npm test

# Development server
npm run dev
```

### Running Tests
```bash
npm test

# Expected output:
✔ initializes database and creates notes
✔ searchNotes returns matching notes
✔ listNotes supports pagination
✔ deleteNote reports success
✔ getStats counts categories
✔ inferCategory returns correct category
✔ validators enforce limits
✔ All 12 tests passing
```

---

## 📖 Example Workflows

### Daily Learning Workflow
```
1. Learn something new while coding
2. "Save this: [your learning]. Tags: [relevant tags]"
3. Claude saves it with auto-categorization
4. Later: "What did I learn about X?" — instant recall
```

### Project Setup Workflow
```
1. Research best practices for a new project
2. Save key learnings as you go
3. "Show me all my [framework] notes"
4. Review before starting implementation
```

### Bulk Import Workflow
```
1. Collect notes in a text file during deep work
2. Use structured format: NUMBER. content, tags: tags, ---
3. "Import from path/to/notes.txt"
4. Review import summary (success/duplicates/errors)
5. Fix any errors and re-import if needed
```

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

---

## 📄 License

[Add your license here]

---

## 🆘 Support

**Issues?** Check these first:
1. Is Claude Code restarted after config changes?
2. Is the path in `claude_desktop_config.json` correct?
3. Does `npm run build` complete without errors?
4. Is the database writable at `data/knowledge.db`?

**Still stuck?** Open an issue with:
- Error message
- Steps to reproduce
- Your environment (OS, Node version)

---

## 🎯 Roadmap

- [ ] LLM fallback for malformed import entries (with user confirmation)
- [ ] Export notes to markdown/JSON
- [ ] Tag management (rename, merge, delete)
- [ ] Note editing/updating
- [ ] Full-text search with ranking
- [ ] Web UI for browsing
- [ ] Backup/restore functionality
- [ ] Note linking and backlinks

---

**Built with ❤️ for developers who learn by doing**
