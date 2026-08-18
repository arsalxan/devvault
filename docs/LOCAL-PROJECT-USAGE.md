# Using DevVault Locally in a Project

Guide for using DevVault in a specific project with project-specific notes.

---

## 🎯 **Use Case**

You want:
- ✅ Different notes database per project
- ✅ Project-specific knowledge base
- ✅ Team members can use the same notes
- ✅ Notes committed to git (optional)

---

## 📦 **Installation**

### **Method 1: Install from GitHub**

```bash
# Navigate to your project
cd /path/to/your/project

# Install locally
npm install git+https://github.com/arsalxan/devvault.git

# Or install as dev dependency
npm install --save-dev git+https://github.com/arsalxan/devvault.git
```

### **Method 2: Install from local path**

```bash
cd /path/to/your/project
npm install /path/to/devvault
```

---

## 🔧 **Configuration**

### **Step 1: Add to package.json scripts (Optional)**

```json
{
  "scripts": {
    "mcp": "devvault"
  }
}
```

### **Step 2: Configure Claude Code**

Edit `~/.claude/config/claude_desktop_config.json`:

#### **Option A: Using npx (Recommended)**

```json
{
  "mcpServers": {
    "my-project-devvault": {
      "command": "npx",
      "args": ["--yes", "devvault"],
      "cwd": "C:/path/to/your/project",
      "env": {
        "DEVVAULT_DB_PATH": "C:/path/to/your/project/.devvault/knowledge.db"
      }
    }
  }
}
```

#### **Option B: Using node directly**

```json
{
  "mcpServers": {
    "my-project-devvault": {
      "command": "node",
      "args": ["node_modules/devvault/dist/mcp-server/server.js"],
      "cwd": "C:/path/to/your/project",
      "env": {
        "DEVVAULT_DB_PATH": ".devvault/knowledge.db"
      }
    }
  }
}
```

#### **Option C: Multiple projects**

```json
{
  "mcpServers": {
    "devvault-projectA": {
      "command": "npx",
      "args": ["--yes", "devvault"],
      "cwd": "C:/projects/projectA",
      "env": {
        "DEVVAULT_DB_PATH": "C:/projects/projectA/.devvault/knowledge.db"
      }
    },
    "devvault-projectB": {
      "command": "npx",
      "args": ["--yes", "devvault"],
      "cwd": "C:/projects/projectB",
      "env": {
        "DEVVAULT_DB_PATH": "C:/projects/projectB/.devvault/knowledge.db"
      }
    },
    "devvault-global": {
      "command": "devvault"
    }
  }
}
```

---

## 💾 **Database Location Options**

### **Option 1: In Project Directory (Recommended for team)**

```bash
# Database location
your-project/.devvault/knowledge.db
```

**Claude config:**
```json
{
  "env": {
    "DEVVAULT_DB_PATH": "./.devvault/knowledge.db"
  }
}
```

**Add to .gitignore if private:**
```gitignore
.devvault/
```

**Or commit if shared:**
```bash
git add .devvault/knowledge.db
git commit -m "Add team knowledge base"
```

### **Option 2: In Project Root**

```bash
# Database location
your-project/project-notes.db
```

**Claude config:**
```json
{
  "env": {
    "DEVVAULT_DB_PATH": "./project-notes.db"
  }
}
```

### **Option 3: Outside Project (Private)**

```bash
# Database location
~/Documents/project-notes/myproject.db
```

**Claude config:**
```json
{
  "env": {
    "DEVVAULT_DB_PATH": "C:/Users/You/Documents/project-notes/myproject.db"
  }
}
```

---

## 🚀 **Usage Examples**

### **Example 1: Single Project Setup**

```bash
# Setup
cd ~/projects/myapp
npm install git+https://github.com/arsalxan/devvault.git
mkdir .devvault

# Add to .gitignore (optional)
echo ".devvault/" >> .gitignore
```

**Claude config:**
```json
{
  "mcpServers": {
    "myapp-notes": {
      "command": "npx",
      "args": ["--yes", "devvault"],
      "cwd": "C:/Users/You/projects/myapp",
      "env": {
        "DEVVAULT_DB_PATH": "./.devvault/knowledge.db"
      }
    }
  }
}
```

### **Example 2: Team Shared Knowledge Base**

```bash
# Setup
cd ~/projects/team-project
npm install --save-dev git+https://github.com/arsalxan/devvault.git
mkdir .devvault

# Add to package.json
{
  "devDependencies": {
    "devvault": "github:arsalxan/devvault"
  }
}

# Commit the database
git add .devvault/knowledge.db package.json
git commit -m "Add team knowledge base"
```

**Team members install:**
```bash
git clone <repo>
cd team-project
npm install
# DevVault is ready to use!
```

### **Example 3: Per-Branch Knowledge**

Different notes for different branches:

**Claude config:**
```json
{
  "mcpServers": {
    "devvault-main": {
      "command": "npx",
      "args": ["--yes", "devvault"],
      "cwd": "C:/projects/myapp",
      "env": {
        "DEVVAULT_DB_PATH": "./.devvault/main-branch.db"
      }
    },
    "devvault-feature": {
      "command": "npx",
      "args": ["--yes", "devvault"],
      "cwd": "C:/projects/myapp",
      "env": {
        "DEVVAULT_DB_PATH": "./.devvault/feature-branch.db"
      }
    }
  }
}
```

---

## 🔀 **Switching Between Global and Local**

### **Use Both Simultaneously**

```json
{
  "mcpServers": {
    "devvault-global": {
      "command": "devvault",
      "description": "Personal global knowledge"
    },
    "devvault-project": {
      "command": "npx",
      "args": ["--yes", "devvault"],
      "cwd": "C:/projects/current-project",
      "env": {
        "DEVVAULT_DB_PATH": "./.devvault/knowledge.db"
      }
    }
  }
}
```

**Claude will show both:**
- Save personal notes → goes to global database
- Save project notes → goes to project database

---

## 📝 **Project .npmrc (Optional)**

Create `.npmrc` in project root:

```ini
# Use specific registry or config for this project
# (optional, only if needed)
```

---

## 🎨 **Project-Specific Categories**

You can customize categories per project by creating a local config:

**Create `.devvault-config.js` in project:**

```javascript
export const projectCategories = [
  'api',
  'database',
  'frontend',
  'backend',
  'deployment',
  'testing',
  'documentation'
];
```

*(Note: This feature would need to be implemented in DevVault)*

---

## 🧪 **Testing Local Setup**

### **Test 1: Check installation**

```bash
cd /path/to/your/project
npx devvault --version
# Should output: DevVault MCP server running on stdio
```

### **Test 2: Check database location**

```bash
# Unix/macOS
ls -la .devvault/

# Windows
dir .devvault\
```

### **Test 3: Test with Claude**

In Claude Code:
```
"Save this to my project notes: API endpoint is /api/v1/users. Tags: api, project"
```

Check database:
```bash
# Unix/macOS
ls -la .devvault/knowledge.db

# Windows
dir .devvault\knowledge.db
```

---

## 🔄 **Updating Local Installation**

```bash
cd /path/to/your/project

# Update to latest
npm update devvault

# Or reinstall
npm uninstall devvault
npm install git+https://github.com/arsalxan/devvault.git
```

---

## 📊 **Comparison: Global vs Local**

| Aspect | Global Install | Local Install |
|--------|---------------|---------------|
| Command | `devvault` | `npx devvault` |
| Database | `~/.devvault/knowledge.db` | `./.devvault/knowledge.db` |
| Scope | All projects | One project |
| Team sharing | Personal only | Can commit to git |
| Updates | `npm update -g` | `npm update` |
| Config | Simple | Needs `cwd` and `env` |
| Use case | Personal notes | Project-specific |

---

## 💡 **Best Practices**

### **For Personal Projects:**
- Use local install with `.devvault/` in `.gitignore`
- Keeps project notes separate from global notes

### **For Team Projects:**
- Install as devDependency
- Commit `.devvault/knowledge.db` to git
- Share knowledge base with team

### **For Client Projects:**
- Keep database outside project folder
- Use client-specific database paths
- Never commit sensitive client info

### **For Open Source:**
- Use local install for project docs
- Commit example knowledge base
- Add to `CONTRIBUTING.md`

---

## 🆘 **Troubleshooting**

### **"Cannot find module 'devvault'"**

```bash
# Make sure it's installed locally
npm list devvault

# Reinstall if needed
npm install git+https://github.com/arsalxan/devvault.git
```

### **npx not finding devvault**

```bash
# Use --yes flag to auto-install
npx --yes devvault
```

### **Database not created**

```bash
# Create directory manually
mkdir -p .devvault

# Check env variable in Claude config
"env": {
  "DEVVAULT_DB_PATH": "./.devvault/knowledge.db"
}
```

### **Multiple instances conflict**

Each MCP server needs a unique name:
```json
{
  "mcpServers": {
    "devvault-project1": { ... },
    "devvault-project2": { ... }
  }
}
```

---

## 📚 **Example Project Structure**

```
your-project/
├── .devvault/
│   └── knowledge.db          # Project knowledge base
├── node_modules/
│   └── devvault/             # Local installation
├── src/
├── .gitignore                # Add .devvault/ if private
├── package.json              # devvault in dependencies
└── README.md
```

---

## 🎯 **Quick Setup Script**

Save as `setup-devvault.sh`:

```bash
#!/bin/bash

# Install DevVault locally
npm install git+https://github.com/arsalxan/devvault.git

# Create .devvault directory
mkdir -p .devvault

# Add to .gitignore (optional)
echo ".devvault/" >> .gitignore

echo "✅ DevVault installed locally!"
echo "📝 Update Claude config with:"
echo ""
echo '{
  "mcpServers": {
    "project-devvault": {
      "command": "npx",
      "args": ["--yes", "devvault"],
      "cwd": "'$(pwd)'",
      "env": {
        "DEVVAULT_DB_PATH": "./.devvault/knowledge.db"
      }
    }
  }
}'
```

**Run it:**
```bash
chmod +x setup-devvault.sh
./setup-devvault.sh
```

---

**🎉 You're ready to use DevVault locally in your project!** 📁✨
