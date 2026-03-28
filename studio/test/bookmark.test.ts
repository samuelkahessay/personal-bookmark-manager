import { Bookmark } from '../types/bookmark';

describe('Bookmark Type', () => {
  it('should accept valid bookmark object', () => {
    const bookmark: Bookmark = {
      id: '123',
      url: 'https://example.com',
      title: 'Example',
      tags: ['test', 'example'],
      createdAt: new Date().toISOString(),
    };

    expect(bookmark.id).toBe('123');
    expect(bookmark.url).toBe('https://example.com');
    expect(bookmark.title).toBe('Example');
    expect(bookmark.tags).toEqual(['test', 'example']);
    expect(bookmark.createdAt).toBeDefined();
  });

  it('should accept empty tags array', () => {
    const bookmark: Bookmark = {
      id: '456',
      url: 'https://test.com',
      title: 'Test',
      tags: [],
      createdAt: new Date().toISOString(),
    };

    expect(bookmark.tags).toEqual([]);
  });
});
