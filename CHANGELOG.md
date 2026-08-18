# Changelog

All notable changes to DevVault are documented in this file.

---

## [1.1.0] - 2026-08-18

### Added
- **Global installation support** - Install once, use from anywhere
- `DEVVAULT_DB_PATH` environment variable for custom database location
- GLOBAL-INSTALL.md documentation
- npm bin entry for `devvault` command

### Changed
- Database path now defaults to `~/.devvault/knowledge.db` (home directory)
- Updated README with global install instructions
- Added shebang to server.ts for direct execution
- Updated package.json with bin field and preferGlobal flag

### Fixed
- Database tests now properly override DB_PATH for isolation

---

## [1.0.0] - 2026-08-18

### Added
- `import_file` tool for bulk importing notes from .txt/.md files
- Duplicate detection with 90% similarity threshold
- Comprehensive documentation (README, SETUP, IMPORT-FORMAT guides)
- String similarity utility using Levenshtein distance

### Changed
- Updated README with complete user guide
- Updated CLAUDE.md with import_file documentation
- Added MAX_IMPORT_FILE_SIZE setting (50KB)

### Security
- Directory traversal prevention
- File type restrictions (.txt, .md only)
- Size validation and limits

---

## [0.1.0] - 2026-08-17

### Added
- Initial MCP server implementation
- Core tools: add_note, search_notes, list_notes, delete_note, get_stats
- Auto-categorization system
- SQLite database with migrations
