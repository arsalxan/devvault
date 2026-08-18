# Global Installation Guide

Use DevVault from anywhere on your system without being in the project directory.

---

## 🌍 Why Global Install?

**Before (local only):**
- Must be in project directory
- Config points to specific project path
- Can't use from other locations

**After (global):**
- Install once, use anywhere
- Simple config: just `"devvault"`
- Database in your home directory
- Update easily with `npm update -g devvault`

---

## 📦 Installation Methods

### Method 1: NPM Global Install (Recommended)

```bash
# Navigate to project directory
cd /path/to/devvault

# Build the project
npm run build

# Install globally
npm install -g .

# Verify installation
devvault --version  # Should show: DevVault MCP server running on stdio
```

### Method 2: NPM Link (For Development)

```bash
# Navigate to project directory
cd /path/to/devvault

# Build the project
npm run build

# Create global symlink
npm link

# Verify
which devvault  # Unix/macOS
where devvault  # Windows
```

---

## ⚙️ Claude Code Configuration

### Simple Configuration (Global Install)

Edit your Claude config file:

**Windows:** `%USERPROFILE%\.claude\config\claude_desktop_config.json`  
**macOS/Linux:** `~/.claude/config/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "devvault": {
      "command": "devvault"
    }
  }
}
```

That's it! No absolute paths needed.

---

## 💾 Database Location

### Default Location

DevVault stores your database in your home directory:

**Windows:**
```
C:\Users\YourUsername\.devvault\knowledge.db
```

**macOS:**
```
/Users/yourname/.devvault/knowledge.db
```

**Linux:**
```
/home/yourname/.devvault/knowledge.db
```

### Custom Database Location

Set the `DEVVAULT_DB_PATH` environment variable:

**Windows (PowerShell):**
```powershell
[System.Environment]::SetEnvironmentVariable('DEVVAULT_DB_PATH', 'D:\my-notes\knowledge.db', 'User')
```

**macOS/Linux (bash/zsh):**
```bash
# Add to ~/.bashrc or ~/.zshrc
export DEVVAULT_DB_PATH="$HOME/Documents/devvault/knowledge.db"
```

**Claude Config with Custom Path:**
```json
{
  "mcpServers": {
    "devvault": {
      "command": "devvault",
      "env": {
        "DEVVAULT_DB_PATH": "/custom/path/knowledge.db"
      }
    }
  }
}
```

---

## 🔄 Updating DevVault

### If Installed Globally

```bash
cd /path/to/devvault
git pull
npm run build
npm install -g .
```

### If Using npm link

```bash
cd /path/to/devvault
git pull
npm run build
# Changes automatically reflected (it's a symlink)
```

---

## 🗑️ Uninstalling

### Remove Global Installation

```bash
npm uninstall -g devvault
```

### Remove npm link

```bash
npm unlink -g devvault
```

### Remove Database (Optional)

**Windows:**
```powershell
Remove-Item -Recurse -Force "$env:USERPROFILE\.devvault"
```

**macOS/Linux:**
```bash
rm -rf ~/.devvault
```

---

## 🔍 Verification

### Test Global Installation

```bash
# Check if devvault command exists
devvault --version

# Check where it's installed
which devvault  # Unix/macOS
where devvault  # Windows

# Test with Claude Code
# Just restart Claude and try: "Save this: test. Tags: test"
```

### Check Database Location

```bash
# Unix/macOS
ls -la ~/.devvault/

# Windows
dir %USERPROFILE%\.devvault\
```

---

## 🆘 Troubleshooting

### "devvault: command not found"

**Fix:**
```bash
# Check npm global bin directory
npm config get prefix

# Add to PATH if needed (Unix/macOS)
export PATH="$PATH:$(npm config get prefix)/bin"

# Add to PATH if needed (Windows)
# Add this to System Environment Variables:
# %APPDATA%\npm
```

### "Cannot find module" errors

**Fix:**
```bash
cd /path/to/devvault
npm install
npm run build
npm install -g .
```

### Database permission errors

**Fix:**
```bash
# Create directory manually
mkdir -p ~/.devvault
chmod 755 ~/.devvault
```

### Still using old local version

**Fix:**
```bash
# Remove old installation
npm uninstall -g devvault

# Reinstall
cd /path/to/devvault
npm install -g .

# Restart Claude Code
```

---

## 🎯 Advantages of Global Install

✅ **Portable** — Works from any directory  
✅ **Simple config** — No absolute paths  
✅ **Single database** — All notes in one place  
✅ **Easy updates** — One command to update  
✅ **Clean** — No project directory needed for daily use  
✅ **Shareable** — Publish to npm for others to use  

---

## 📊 Comparison

| Feature | Local Install | Global Install |
|---------|--------------|----------------|
| Config complexity | Absolute paths | Just `"devvault"` |
| Works from anywhere | ❌ No | ✅ Yes |
| Database location | Project dir | Home dir |
| Update process | Manual | `npm update -g` |
| Multiple projects | Separate DBs | Single shared DB |
| Claude config | Long paths | Simple command |

---

## 🚀 Publishing to NPM (Optional)

Want to share DevVault with others?

```bash
# Login to npm
npm login

# Publish (first time)
npm publish

# Update version and publish again
npm version patch  # or minor, or major
npm publish
```

Then anyone can install:
```bash
npm install -g devvault
```

---

## 📝 Summary

**Quick Setup:**
1. `cd /path/to/devvault`
2. `npm run build`
3. `npm install -g .`
4. Update Claude config to: `"command": "devvault"`
5. Restart Claude Code
6. Done! 🎉

**Database:** `~/.devvault/knowledge.db`  
**Config:** Simple `"devvault"` command  
**Works:** From anywhere!

---

**Happy global knowledge management! 🌍**
