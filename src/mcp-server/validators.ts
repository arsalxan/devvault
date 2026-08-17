import { z } from 'zod';
import { SETTINGS } from '../config/settings';

// ============ INPUT SCHEMAS ============

export const AddNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'Content cannot be empty')
    .max(SETTINGS.MAX_CONTENT_LENGTH, `Content cannot exceed ${SETTINGS.MAX_CONTENT_LENGTH} characters`),
  tags: z
    .array(z.string().max(SETTINGS.MAX_TAG_LENGTH, `Each tag cannot exceed ${SETTINGS.MAX_TAG_LENGTH} characters`))
    .min(1, 'At least one tag is required')
    .max(SETTINGS.MAX_TAGS_PER_NOTE, `Cannot have more than ${SETTINGS.MAX_TAGS_PER_NOTE} tags`),
});

export const SearchNotesSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query cannot be empty')
    .max(SETTINGS.MAX_QUERY_LENGTH, `Query cannot exceed ${SETTINGS.MAX_QUERY_LENGTH} characters`),
  limit: z
    .number()
    .int()
    .min(1)
    .max(SETTINGS.SEARCH_RESULTS_MAX)
    .default(SETTINGS.SEARCH_RESULTS_DEFAULT),
});

export const ListNotesSchema = z.object({
  page: z
    .number()
    .int()
    .min(1)
    .default(1),
  limit: z
    .number()
    .int()
    .min(1)
    .max(SETTINGS.MAX_PAGE_SIZE)
    .default(SETTINGS.DEFAULT_PAGE_SIZE),
  category: z
    .enum(SETTINGS.VALID_CATEGORIES)
    .optional(),
});

export const DeleteNoteSchema = z.object({
  id: z
    .number()
    .int()
    .positive('Note ID must be a positive number'),
  confirmText: z
    .literal('DELETE_NOTE'),
});