/*
  DevVault Database Schema

  Table: notes
  ┌──────────────┬──────────┬─────────────────────────────────┐
  │ Column       │ Type     │ Purpose                         │
  ├──────────────┼──────────┼─────────────────────────────────┤
  │ id           │ INTEGER  │ Primary key, auto-increment     │
  │ content      │ TEXT     │ The actual note/snippet         │
  │ tags         │ TEXT     │ Comma-separated tags            │
  │ category     │ TEXT     │ Auto-assigned: frontend,        │
  │              │          │ backend, devops, database, etc. │
  │ created_at   │ TEXT     │ ISO timestamp                   │
  │ updated_at   │ TEXT     │ ISO timestamp                   │
  └──────────────┴──────────┴─────────────────────────────────┘
*/
import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync } from 'fs';
import { SETTINGS } from '../config/settings';

let db: Database.Database | null = null;

export interface Note {
  id: number;
  content: string;
  tags: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface SearchNotesResult {
  notes: Note[];
  total: number;
}

export function initDatabase(): Database.Database {
  if (db) {
    return db;
  }

  const dbPath = SETTINGS.DB_PATH;
  mkdirSync(path.dirname(dbPath), { recursive: true });

  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'general',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_notes_category_created_at
    ON notes (category, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_notes_created_at
    ON notes (created_at DESC);

    CREATE TRIGGER IF NOT EXISTS trg_notes_touch_updated_at
    AFTER UPDATE ON notes
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
    BEGIN
      UPDATE notes
      SET updated_at = datetime('now')
      WHERE id = NEW.id;
    END;
  `);

  return db;
}

export function closeDatabase(): void {
  if (!db) {
    return;
  }
  db.close();
  db = null;
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function addNote(content: string, tags: string, category: string): Note {
  const database = getDatabase();
  const stmt = database.prepare(`
    INSERT INTO notes (content, tags, category)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(content, tags, category);

  return database.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid) as Note;
}

export function searchNotes(query: string, limit: number): SearchNotesResult {
  const database = getDatabase();
  const searchTerm = `%${query}%`;

  const total = (
    database
      .prepare(`
        SELECT COUNT(*) as count FROM notes
        WHERE content LIKE ? OR tags LIKE ? OR category LIKE ?
      `)
      .get(searchTerm, searchTerm, searchTerm) as { count: number }
  ).count;

  const notes = database
    .prepare(`
      SELECT * FROM notes
      WHERE content LIKE ? OR tags LIKE ? OR category LIKE ?
      ORDER BY created_at DESC
      LIMIT ?
    `)
    .all(searchTerm, searchTerm, searchTerm, limit) as Note[];

  return { notes, total };
}

export function listNotes(page: number, limit: number, category?: string): { notes: Note[]; total: number } {
  const database = getDatabase();
  const offset = (page - 1) * limit;

  let notes: Note[];
  let total: number;

  if (category) {
    notes = database.prepare(`
      SELECT * FROM notes WHERE category = ?
      ORDER BY created_at DESC LIMIT ? OFFSET ?
    `).all(category, limit, offset) as Note[];

    total = (database.prepare('SELECT COUNT(*) as count FROM notes WHERE category = ?').get(category) as { count: number }).count;
  } else {
    notes = database.prepare(`
      SELECT * FROM notes
      ORDER BY created_at DESC LIMIT ? OFFSET ?
    `).all(limit, offset) as Note[];

    total = (database.prepare('SELECT COUNT(*) as count FROM notes').get() as { count: number }).count;
  }

  return { notes, total };
}

export function deleteNote(id: number): boolean {
  const database = getDatabase();
  const result = database.prepare('DELETE FROM notes WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getNoteById(id: number): Note | undefined {
  const database = getDatabase();
  return database.prepare('SELECT * FROM notes WHERE id = ?').get(id) as Note | undefined;
}

export function getStats(): { total: number; categories: Record<string, number>; topTags: { tag: string; count: number }[] } {
  const database = getDatabase();

  const total = (database.prepare('SELECT COUNT(*) as count FROM notes').get() as { count: number }).count;

  const categoryRows = database.prepare('SELECT category, COUNT(*) as count FROM notes GROUP BY category').all() as { category: string; count: number }[];
  const categories: Record<string, number> = {};
  categoryRows.forEach((row) => { categories[row.category] = row.count; });

  const allNotes = database.prepare("SELECT tags FROM notes WHERE tags != ''").all() as { tags: string }[];
  const tagCount: Record<string, number> = {};
  allNotes.forEach((note) => {
    note.tags.split(',').forEach((tag) => {
      const trimmed = tag.trim().toLowerCase();
      if (trimmed) {
        tagCount[trimmed] = (tagCount[trimmed] || 0) + 1;
      }
    });
  });

  const topTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  return { total, categories, topTags };
}