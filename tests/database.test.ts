import test, { after, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  addNote,
  closeDatabase,
  deleteNote,
  getDatabase,
  getNoteById,
  getStats,
  initDatabase,
  listNotes,
  searchNotes,
} from '../src/mcp-server/database';

let temporaryDirectory: string;
let originalWorkingDirectory: string;

before(() => {
  originalWorkingDirectory = process.cwd();
  temporaryDirectory = mkdtempSync(path.join(tmpdir(), 'devvault-tests-'));
  process.chdir(temporaryDirectory);
  initDatabase();
});

beforeEach(() => {
  getDatabase().exec('DELETE FROM notes');
});

after(() => {
  closeDatabase();
  process.chdir(originalWorkingDirectory);
  rmSync(temporaryDirectory, { recursive: true, force: true });
});

test('initializes an idempotent database and creates notes', () => {
  const database = initDatabase();
  assert.equal(database, getDatabase());

  const note = addNote('Use SQLite', 'database, sqlite', 'database');
  assert.equal(note.id, 1);
  assert.equal(note.content, 'Use SQLite');
  assert.equal(getNoteById(note.id)?.tags, 'database, sqlite');
});

test('searchNotes returns matching notes, result limit, and total count', () => {
  addNote('React hooks cleanup', 'react, frontend', 'frontend');
  addNote('SQLite indexes', 'sqlite, database', 'database');
  addNote('React testing patterns', 'react, testing', 'testing');

  const result = searchNotes('react', 1);
  assert.equal(result.total, 2);
  assert.equal(result.notes.length, 1);
  assert.match(result.notes[0].content, /React/i);
});

test('listNotes supports pagination and category filtering', () => {
  addNote('First', 'one', 'general');
  addNote('Second', 'two', 'backend');
  addNote('Third', 'three', 'backend');

  const page = listNotes(1, 1);
  assert.equal(page.total, 3);
  assert.equal(page.notes.length, 1);

  const backendNotes = listNotes(1, 10, 'backend');
  assert.equal(backendNotes.total, 2);
  assert.equal(backendNotes.notes.every((note) => note.category === 'backend'), true);
});

test('deleteNote reports whether a record was deleted', () => {
  const note = addNote('Temporary note', 'temporary', 'general');
  assert.equal(deleteNote(note.id), true);
  assert.equal(deleteNote(note.id), false);
  assert.equal(getNoteById(note.id), undefined);
});

test('getStats counts categories and normalizes tags', () => {
  addNote('One', 'TypeScript, code', 'language');
  addNote('Two', 'typescript, database', 'database');

  const stats = getStats();
  assert.equal(stats.total, 2);
  assert.equal(stats.categories.language, 1);
  assert.equal(stats.categories.database, 1);
  assert.deepEqual(stats.topTags[0], { tag: 'typescript', count: 2 });
});
