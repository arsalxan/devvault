# Quick Global Install Guide

Follow these steps to install DevVault globally on your system.

## 🚀 Installation (5 minutes)

### Step 1: Build & Install Globally

```bash
# You're already in the project directory
npm run build
npm install -g .
```

### Step 2: Verify Installation

```bash
# Check if devvault command exists
devvault --version
# Should show: DevVault MCP server running on stdio
# (Press Ctrl+C to exit)
```

### Step 3: Update Claude Config

Edit your Claude config file:

**Windows:**
```
C:\Users\MdArsalanSiddiqui\.claude\config\claude_desktop_config.json
```

**Change from:**
```json
{
  "mcpServers": {
    "devvault": {
      "command": "node",
      "args": ["C:/Users/MdArsalanSiddiqui/Desktop/ClaudeProjects/devvault/dist/mcp-server/server.js"]
    }
  }
}
```

**To:**
```json
{
  "mcpServers": {
    "devvault": {
      "command": "devvault"
    }
  }
}
```

### Step 4: Restart Claude Code

- Close Claude Code completely
- Restart it
- Test: "Save this: test note. Tags: test"

## ✅ Done!

Your database is now at:
```
C:\Users\MdArsalanSiddiqui\.devvault\knowledge.db
```

You can now use DevVault from anywhere!

## 🔄 Future Updates

When you pull new changes:

```bash
cd /path/to/devvault
git pull
npm run build
npm install -g .
```

That's it!

---

## 📍 Current Status

Your commits are ready to push:
- ✅ Commit 1: `Add import_file tool with duplicate detection`
- ✅ Commit 2: `Add global installation support`

To push:
```bash
git push origin main
```

(You'll need to set up SSH keys or use HTTPS first)

---

**Enjoy your globally installed DevVault! 🎉**
