import test from 'node:test';
import assert from 'node:assert/strict';
import { inferCategory } from '../src/config/settings';

test('inferCategory returns backend for API content', () => {
  const category = inferCategory('Build a REST API with auth middleware', ['node', 'express']);
  assert.equal(category, 'backend');
});

test('inferCategory falls back to general', () => {
  const category = inferCategory('Remember to review notes this week', ['personal']);
  assert.equal(category, 'general');
});
