import { Bookmark } from '@/types/bookmark';

/**
 * Filters bookmarks by a search query, matching against title and tags (case-insensitive).
 */
export function filterBookmarks(bookmarks: Bookmark[], query: string): Bookmark[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return bookmarks;
  return bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(lowerQuery) ||
      b.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
