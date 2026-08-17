/*
  DevVault Configuration
  
  Central place for all limits, defaults, and constants.
  Change behavior here — not scattered across code.
*/

export const SETTINGS = {
  // Database
  DB_PATH: 'data/knowledge.db',

  // Pagination (Token Management)
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  SEARCH_RESULTS_DEFAULT: 5,
  SEARCH_RESULTS_MAX: 5,

  // Input Limits (Security)
  MAX_CONTENT_LENGTH: 5000,
  MAX_TAG_LENGTH: 30,
  MAX_TAGS_PER_NOTE: 10,
  MAX_QUERY_LENGTH: 200,

  // Categories (Auto-assigned by Claude)
  VALID_CATEGORIES: [
    'frontend',
    'backend',
    'database',
    'devops',
    'security',
    'testing',
    'architecture',
    'language',
    'tool',
    'general'
  ] as const,
} as const;

export type Category = typeof SETTINGS.VALID_CATEGORIES[number];

export const CATEGORY_KEYWORDS: Record<Exclude<Category, 'general'>, string[]> = {
  frontend: ['react', 'vue', 'angular', 'css', 'html', 'dom', 'ui', 'tailwind', 'vite', 'next'],
  backend: ['api', 'server', 'node', 'express', 'fastify', 'rest', 'graphql', 'auth', 'jwt'],
  database: ['sql', 'sqlite', 'postgres', 'mysql', 'database', 'index', 'query', 'migration'],
  devops: ['docker', 'kubernetes', 'k8s', 'ci', 'cd', 'deploy', 'pipeline', 'terraform'],
  security: ['xss', 'csrf', 'sanitize', 'security', 'encryption', 'hash', 'token', 'oauth'],
  testing: ['test', 'jest', 'vitest', 'mocha', 'cypress', 'playwright', 'assert', 'coverage'],
  architecture: ['architecture', 'design pattern', 'microservice', 'monolith', 'scalability'],
  language: ['typescript', 'javascript', 'python', 'go', 'rust', 'java', 'c#', 'syntax'],
  tool: ['git', 'npm', 'pnpm', 'yarn', 'vscode', 'mcp', 'cli', 'webpack', 'eslint', 'prettier'],
};

export function inferCategory(content: string, tags: string[]): Category {
  const searchText = `${content} ${tags.join(' ')}`.toLowerCase();

  for (const category of SETTINGS.VALID_CATEGORIES) {
    if (category === 'general') {
      continue;
    }
    const keywords = CATEGORY_KEYWORDS[category];
    if (keywords.some((keyword) => {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(?:^|\\s)${escapedKeyword}(?:$|\\s|[,.;:!?()\\[\\]{}])`, 'i').test(searchText);
    })) {
      return category;
    }
  }

  return 'general';
}