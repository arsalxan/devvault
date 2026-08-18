# Import File Format Guide

Complete guide to creating import files for bulk importing notes into DevVault.

---

## 📋 Basic Format

The structured format is the recommended way to import multiple notes:

```
1.
Your first note content here.
Can span multiple lines.
tags: tag1, tag2, tag3
---
2.
Your second note content here.
tags: tag4, tag5
---
3.
Third note content.
tags: tag6, tag7, tag8
---
```

### Format Rules

| Element | Rule | Example |
|---------|------|---------|
| **Number** | Start each entry with `NUMBER.` | `1.`, `2.`, `3.` |
| **Content** | Everything after number until `tags:` | Multi-line, max 5000 chars |
| **Tags line** | Format: `tags: tag1, tag2, tag3` | Last line before separator |
| **Separator** | Three dashes on new line | `---` |

---

## ✅ Valid Examples

### Single-line Note
```
1.
git reset --hard HEAD~1 reverts to previous commit
tags: git, revert, commands
---
```

### Multi-line Note
```
2.
useEffect cleanup function runs when:
- Component unmounts
- Dependencies change (before next run)
- Parent re-renders (if no dependency array)

Always clean up subscriptions, timers, event listeners.
tags: react, hooks, useEffect, cleanup
---
```

### Note with Code
```
3.
SQL JOIN types:

INNER JOIN:
SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id;

LEFT JOIN:
SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id;

Returns all users, with NULL for orders if no match.
tags: sql, database, joins, query
---
```

### Note with Special Characters
```
4.
Regex for email validation: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
Matches: user@example.com, test.user@domain.co.uk
tags: regex, validation, email
---
```

---

## ❌ Invalid Examples

### Missing Number
```
❌ WRONG:
Content without number
tags: tag1, tag2
---

✅ CORRECT:
1.
Content with number
tags: tag1, tag2
---
```

### Missing Tags Line
```
❌ WRONG:
1.
Content here but no tags line
---

✅ CORRECT:
1.
Content here with tags line
tags: general, note
---
```

### Missing Separator
```
❌ WRONG:
1.
First note
tags: tag1
2.
Second note immediately after
tags: tag2

✅ CORRECT:
1.
First note
tags: tag1
---
2.
Second note with separator
tags: tag2
---
```

### Incorrect Tag Format
```
❌ WRONG:
1.
Content here
tag: git, commands  ← Missing 's'
---

✅ CORRECT:
1.
Content here
tags: git, commands  ← Correct
---
```

---

## 📏 Size Limits

| Limit | Value | Consequence if exceeded |
|-------|-------|------------------------|
| **Max content** | 5,000 characters | Entry rejected, must split |
| **Max entry size** | 5,300 characters | Entry rejected, must shorten |
| **Max tags per entry** | 10 tags | Parse error |
| **Max tag length** | 30 characters | Parse error |
| **Max file size** | 50 KB | File rejected entirely |

### Checking Entry Size

**Count characters:**
- Content: everything after `NUMBER.` until `tags:`
- Entry: entire chunk including number, content, tags, separator

**Example:**
```
1.                          ← 2 chars
Content goes here (500)     ← 500 chars
tags: git, commands (19)    ← 19 chars
---                         ← 3 chars
                            = 524 chars total (✅ under 5300)
```

---

## 🔄 Duplicate Detection

DevVault checks for 90% similarity against existing notes.

### Examples

#### Will Be Detected as Duplicate ❌
```
Existing note: "git merge combines two branches"
New note: "git merge combines branches together"
→ 92% similar → SKIPPED
```

#### Will Be Saved as Different ✅
```
Existing note: "git checkout switches branches"
New note: "git checkout reverts file changes"
→ Same command, different use case → SAVED
```

#### Similarity Calculation
- Based on Levenshtein distance algorithm
- Compares content only (not tags)
- Case-insensitive comparison
- Whitespace normalized

---

## 🎯 Best Practices

### 1. Number Your Entries Sequentially
```
✅ GOOD:
1.
...
---
2.
...
---
3.
...

⚠️ WORKS BUT CONFUSING:
5.
...
---
1.
...
---
10.
...
```

### 2. Use Specific, Searchable Tags
```
✅ GOOD:
tags: react, hooks, useEffect, lifecycle

❌ TOO VAGUE:
tags: code, programming, stuff
```

### 3. Keep Related Concepts Together
```
✅ GOOD:
1.
useState creates stateful values in function components.
const [count, setCount] = useState(0);
tags: react, hooks, useState
---
2.
useEffect runs after render, similar to componentDidMount.
tags: react, hooks, useEffect, lifecycle
---

❌ SCATTERED:
1.
useState...
tags: react
---
15.
useEffect...
tags: react
---
```

### 4. Include Context and Examples
```
✅ GOOD:
git rebase -i HEAD~3 opens interactive rebase for last 3 commits.
Commands: pick, reword, edit, squash, fixup, drop.
Use for cleaning up history before pushing.

❌ TOO BRIEF:
git rebase is useful
```

### 5. Use Meaningful First Lines
```
✅ GOOD:
Docker compose networking creates default bridge networks.
Containers can reach each other by service name...

❌ UNCLEAR:
This is about networking.
Docker has this feature...
```

---

## 📦 Fallback Format

If you don't use the structured format, DevVault tries to split by double newlines:

```
First note content here.

Second note content here.

Third note content here.
```

⚠️ **Limitations:**
- No automatic tag assignment (must add manually after import)
- No entry numbers (harder to track errors)
- No category hints
- Less reliable parsing

**Recommendation:** Use the structured format!

---

## 🔧 Handling Errors

### Oversized Entry
```
❌ Entry #5 is too large: 8,450 characters (max: 5,300)

FIX: Split into multiple entries:
5.
First part of content (under 5000 chars)
tags: topic, part1
---
6.
Second part of content (under 5000 chars)
tags: topic, part2
---
```

### Parse Failure
```
❌ Entry #3: Missing "tags:" line

FIX: Add tags line:
3.
Content here
tags: general, note  ← Add this line
---
```

### Duplicate Detected
```
⚠️ Entry #7: 95% similar to note #42

OPTIONS:
1. Skip it (already have this knowledge)
2. Edit to add new information
3. Delete the existing note first
```

---

## 📊 Import Output Guide

### Success
```
✅ Imported 5 notes:
  - Entry #1 → Note ID 45
  - Entry #2 → Note ID 46
  - Entry #3 → Note ID 47
  - Entry #4 → Note ID 48
  - Entry #5 → Note ID 49
```

### Partial Success
```
✅ Imported 3 notes:
  - Entry #1 → Note ID 45
  - Entry #2 → Note ID 46
  - Entry #4 → Note ID 47

❌ Failed to parse:
  - Entry #3: Missing "tags:" line

⚠️ Skipped 1 duplicate:
  - Entry #5: 92% similar to note #23
```

### Complete Failure
```
❌ Cannot process file:

Entry #2 is too large: 8,450 characters
Maximum allowed: 5,300 characters

Please edit the file and split oversized entries.
```

---

## 🎓 Example Templates

### Command Reference Template
```
1.
COMMAND: git reset --hard HEAD~1
PURPOSE: Discard local changes and revert to previous commit
WARNING: Destructive, cannot be undone
ALTERNATIVES: git reset --soft HEAD~1 (keeps changes)
tags: git, reset, revert, commands
---
```

### Code Snippet Template
```
1.
PATTERN: React Custom Hook
CODE:
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);
  
  return [value, setValue];
}

USE CASE: Persistent state across page reloads
tags: react, hooks, custom-hooks, localStorage
---
```

### Concept Explanation Template
```
1.
CONCEPT: Event Loop in JavaScript
HOW IT WORKS:
1. Call stack executes synchronous code
2. Web APIs handle async operations
3. Callback queue holds completed callbacks
4. Event loop moves callbacks to stack when empty

WHY IT MATTERS: Understanding this prevents blocking the UI
GOTCHA: Promises go to microtask queue (higher priority)
tags: javascript, async, event-loop, concepts
---
```

---

## 🚀 Quick Start Checklist

- [ ] Create a `.txt` or `.md` file
- [ ] Number each entry: `1.`, `2.`, `3.`
- [ ] Write content (max 5000 chars per entry)
- [ ] Add tags line: `tags: tag1, tag2`
- [ ] Separate with `---`
- [ ] Check file size (max 50KB)
- [ ] Ask Claude to import: `"Import from path/to/file.txt"`
- [ ] Review import summary
- [ ] Fix any errors and re-import if needed

---

**Ready to bulk import your knowledge? 📥**

See `import-example.md` for a complete working example!
