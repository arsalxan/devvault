# DevVault Setup Guide

Complete step-by-step guide to get DevVault running with Claude Code.

## Prerequisites

- **Node.js** 18+ installed
- **Claude Code** installed (CLI, Desktop, or VS Code extension)
- Basic command-line knowledge

---

## Step 1: Install DevVault

```bash
# Clone or download the repository
cd /path/to/devvault

# Install dependencies
npm install

# Build the project
npm run build
```

**Expected output:**
```
✓ TypeScript compilation successful
✓ Build complete in dist/
```

---

## Step 2: Find Your Claude Config File

The config file location depends on your operating system:

**Windows:**
```
C:\Users\YourUsername\.claude\config\claude_desktop_config.json
```

**macOS:**
```
~/.claude/config/claude_desktop_config.json
```

**Linux:**
```
~/.claude/config/claude_desktop_config.json
```

If the file doesn't exist, create it with an empty JSON object:
```json
{
  "mcpServers": {}
}
```

---

## Step 3: Add DevVault to Claude Config

Edit the config file and add DevVault under `mcpServers`:

### Windows Example:
```json
{
  "mcpServers": {
    "devvault": {
      "command": "node",
      "args": [
        "C:\\Users\\YourUsername\\path\\to\\devvault\\dist\\mcp-server\\server.js"
      ]
    }
  }
}
```

### macOS/Linux Example:
```json
{
  "mcpServers": {
    "devvault": {
      "command": "node",
      "args": [
        "/Users/yourname/path/to/devvault/dist/mcp-server/server.js"
      ]
    }
  }
}
```

⚠️ **Important:**
- Use **absolute paths**, not relative paths
- Use forward slashes `/` or escaped backslashes `\\` on Windows
- Make sure the path points to `dist/mcp-server/server.js`

---

## Step 4: Restart Claude Code

Close and restart Claude Code completely (not just the window).

**CLI:**
```bash
# Just start it again
claude
```

**Desktop App:**
- Quit the app completely
- Restart it

**VS Code Extension:**
- Reload VS Code window (Ctrl+Shift+P → "Reload Window")

---

## Step 5: Verify Installation

Start a conversation with Claude and test DevVault:

```
You: "Save this: git status shows working tree status. Tags: git, commands"
```

**Expected response:**
```
✅ Note saved!
📝 ID: 1
🏷️ Tags: git, commands
📁 Category: tool
📅 Created: [timestamp]
```

If you see this, DevVault is working! 🎉

---

## Troubleshooting

### "MCP server not found" or "Command failed"

**Check:**
1. Is the path in config correct? (absolute path required)
2. Did you run `npm run build`?
3. Does `dist/mcp-server/server.js` exist?
4. Did you restart Claude Code?

**Test manually:**
```bash
cd /path/to/devvault
node dist/mcp-server/server.js
```

If this works, the path in your config is wrong.

---

### "Cannot find module" errors

**Solution:**
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### Database errors

**Check permissions:**
```bash
# Create data directory manually
mkdir data
chmod 755 data
```

The database file `data/knowledge.db` is created automatically on first use.

---

### Path issues on Windows

Use one of these formats:

✅ **Forward slashes:**
```json
"C:/Users/Name/devvault/dist/mcp-server/server.js"
```

✅ **Escaped backslashes:**
```json
"C:\\Users\\Name\\devvault\\dist\\mcp-server\\server.js"
```

❌ **Raw backslashes (invalid JSON):**
```json
"C:\Users\Name\devvault\dist\mcp-server\server.js"
```

---

## Testing Your Setup

### Test 1: Save a note
```
"Save this: Array.map() transforms each element. Tags: javascript, arrays"
```

### Test 2: Search
```
"What do I know about arrays?"
```

### Test 3: List notes
```
"Show me all my notes"
```

### Test 4: Get stats
```
"Show me my knowledge stats"
```

### Test 5: Import file
```
"Import notes from C:/path/to/notes.txt"
```

(Use the example file from `docs/import-example.md`)

---

## Configuration Tips

### Multiple MCP Servers

You can run multiple MCP servers:

```json
{
  "mcpServers": {
    "devvault": {
      "command": "node",
      "args": ["C:/path/to/devvault/dist/mcp-server/server.js"]
    },
    "other-mcp": {
      "command": "node",
      "args": ["C:/path/to/other/server.js"]
    }
  }
}
```

### Custom Database Location

Edit `src/config/settings.ts` before building:

```typescript
export const SETTINGS = {
  DB_PATH: 'custom/path/knowledge.db',  // Change this
  // ... rest of config
}
```

Then rebuild:
```bash
npm run build
```

---

## Next Steps

✅ DevVault is running!

**Now:**
1. Read [README.md](../README.md) for all available tools
2. Check [import-example.md](./import-example.md) for bulk import format
3. Start saving your development knowledge!

**Pro Tips:**
- Save learnings as you code (don't wait!)
- Use specific tags for easier searching
- Review your stats weekly to see growth
- Bulk import existing notes from text files

---

## Need Help?

**Still having issues?**

1. Check the [README.md](../README.md) troubleshooting section
2. Verify Node.js version: `node --version` (need 18+)
3. Check TypeScript compilation: `npm run typecheck`
4. Run tests: `npm test`
5. Open an issue with error details

**Common fixes:**
- Delete `node_modules` and reinstall
- Use absolute paths in config
- Restart Claude Code completely
- Check file permissions on `data/` directory

---

**Happy note-taking! 📝**
