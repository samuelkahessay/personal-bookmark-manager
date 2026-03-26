import { filterBookmarks } from '@/lib/filter';
import { Bookmark } from '@/types/bookmark';

const bookmarks: Bookmark[] = [
  { id: '1', url: 'https://reactjs.org', title: 'React Docs', tags: ['react', 'frontend'], createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', url: 'https://typescriptlang.org', title: 'TypeScript', tags: ['typescript', 'language'], createdAt: '2024-01-02T00:00:00Z' },
  { id: '3', url: 'https://nextjs.org', title: 'Next.js', tags: ['react', 'framework'], createdAt: '2024-01-03T00:00:00Z' },
];

describe('filterBookmarks', () => {
  it('returns all bookmarks when query is empty', () => {
    expect(filterBookmarks(bookmarks, '')).toHaveLength(3);
  });

  it('returns all bookmarks when query is only whitespace', () => {
    expect(filterBookmarks(bookmarks, '   ')).toHaveLength(3);
  });

  it('filters by title (case-insensitive)', () => {
    const result = filterBookmarks(bookmarks, 'react');
    expect(result.map((b) => b.id)).toEqual(expect.arrayContaining(['1']));
    expect(result.find((b) => b.id === '2')).toBeUndefined();
  });

  it('filters by tag (case-insensitive)', () => {
    const result = filterBookmarks(bookmarks, 'typescript');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('matches title case-insensitively', () => {
    const result = filterBookmarks(bookmarks, 'NEXT');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('matches tags case-insensitively', () => {
    const result = filterBookmarks(bookmarks, 'FRONTEND');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('returns bookmarks matching either title or tag', () => {
    // 'react' matches title of bookmark 1, and tag of bookmark 3
    const result = filterBookmarks(bookmarks, 'react');
    expect(result.map((b) => b.id)).toEqual(expect.arrayContaining(['1', '3']));
  });

  it('returns empty array when no bookmarks match', () => {
    expect(filterBookmarks(bookmarks, 'python')).toHaveLength(0);
  });

  it('supports partial matching', () => {
    const result = filterBookmarks(bookmarks, 'scri');
    // matches TypeScript (title) and typescript (tag)
    expect(result.length).toBeGreaterThan(0);
  });
});
