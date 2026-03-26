import { Bookmark } from '@/types/bookmark';

const STORAGE_KEY = 'bookmarks';

export function saveBookmarks(bookmarks: Bookmark[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    // localStorage may be unavailable (private mode, storage quota, etc.)
  }
}

export function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Bookmark[];
  } catch {
    // Corrupted JSON or localStorage unavailable
    return [];
  }
}
