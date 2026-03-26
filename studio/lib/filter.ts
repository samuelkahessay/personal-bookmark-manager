import { Bookmark } from '@/types/bookmark';

export function filterBookmarks(bookmarks: Bookmark[], query: string): Bookmark[] {
  const q = query.toLowerCase().trim();
  if (!q) return bookmarks;
  return bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}
