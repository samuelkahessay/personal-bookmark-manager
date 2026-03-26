import { filterBookmarks } from '@/lib/filter';
import { Bookmark } from '@/types/bookmark';

const bookmarks: Bookmark[] = [
  { id: '1', url: 'https://example.com', title: 'React Guide', tags: ['react', 'web'], createdAt: '2026-01-01T00:00:00Z' },
  { id: '2', url: 'https://next.js.org', title: 'Next.js Docs', tags: ['nextjs', 'web'], createdAt: '2026-01-02T00:00:00Z' },
  { id: '3', url: 'https://typescriptlang.org', title: 'TypeScript Handbook', tags: ['typescript'], createdAt: '2026-01-03T00:00:00Z' },
];

describe('filterBookmarks', () => {
  it('returns all bookmarks when query is empty', () => {
    expect(filterBookmarks(bookmarks, '')).toHaveLength(3);
  });

  it('returns all bookmarks when query is whitespace only', () => {
    expect(filterBookmarks(bookmarks, '   ')).toHaveLength(3);
  });

  it('filters by title (case-insensitive)', () => {
    const result = filterBookmarks(bookmarks, 'react');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('React Guide');
  });

  it('filters by title with uppercase query', () => {
    const result = filterBookmarks(bookmarks, 'NEXT');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Next.js Docs');
  });

  it('filters by tag', () => {
    const result = filterBookmarks(bookmarks, 'web');
    expect(result).toHaveLength(2);
  });

  it('matches if query appears in any tag', () => {
    const result = filterBookmarks(bookmarks, 'typescript');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('TypeScript Handbook');
  });

  it('returns empty array when no bookmarks match', () => {
    expect(filterBookmarks(bookmarks, 'python')).toHaveLength(0);
  });

  it('partial match works for title', () => {
    const result = filterBookmarks(bookmarks, 'guide');
    expect(result).toHaveLength(1);
  });

  it('partial match works for tags', () => {
    const result = filterBookmarks(bookmarks, 'next');
    expect(result).toHaveLength(1);
  });
});
