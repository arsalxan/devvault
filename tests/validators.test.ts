import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AddNoteSchema,
  DeleteNoteSchema,
  ListNotesSchema,
  SearchNotesSchema,
} from '../src/mcp-server/validators';
import { SETTINGS } from '../src/config/settings';

test('AddNoteSchema accepts valid notes and rejects empty content', () => {
  const valid = AddNoteSchema.safeParse({ content: 'Use prepared statements', tags: ['sqlite'] });
  const invalid = AddNoteSchema.safeParse({ content: '', tags: ['sqlite'] });

  assert.equal(valid.success, true);
  assert.equal(invalid.success, false);
});

test('AddNoteSchema enforces content, tag length, and tag count limits', () => {
  assert.equal(
    AddNoteSchema.safeParse({
      content: 'a'.repeat(SETTINGS.MAX_CONTENT_LENGTH + 1),
      tags: ['sqlite'],
    }).success,
    false
  );
  assert.equal(
    AddNoteSchema.safeParse({
      content: 'valid',
      tags: ['a'.repeat(SETTINGS.MAX_TAG_LENGTH + 1)],
    }).success,
    false
  );
  assert.equal(
    AddNoteSchema.safeParse({
      content: 'valid',
      tags: Array.from({ length: SETTINGS.MAX_TAGS_PER_NOTE + 1 }, (_, index) => `tag-${index}`),
    }).success,
    false
  );
});

test('SearchNotesSchema applies defaults and rejects invalid limits', () => {
  const parsed = SearchNotesSchema.parse({ query: 'sqlite' });
  assert.equal(parsed.limit, SETTINGS.SEARCH_RESULTS_DEFAULT);
  assert.equal(SearchNotesSchema.safeParse({ query: 'sqlite', limit: 0 }).success, false);
  assert.equal(SearchNotesSchema.safeParse({ query: 'sqlite', limit: SETTINGS.SEARCH_RESULTS_MAX + 1 }).success, false);
});

test('ListNotesSchema applies defaults and validates categories', () => {
  const parsed = ListNotesSchema.parse({});
  assert.equal(parsed.page, 1);
  assert.equal(parsed.limit, SETTINGS.DEFAULT_PAGE_SIZE);
  assert.equal(ListNotesSchema.safeParse({ category: 'not-a-category' }).success, false);
});

test('DeleteNoteSchema requires exact confirmation text', () => {
  assert.equal(DeleteNoteSchema.safeParse({ id: 1, confirmText: 'DELETE_NOTE' }).success, true);
  assert.equal(DeleteNoteSchema.safeParse({ id: 1, confirmText: 'delete_note' }).success, false);
  assert.equal(DeleteNoteSchema.safeParse({ id: 0, confirmText: 'DELETE_NOTE' }).success, false);
});
