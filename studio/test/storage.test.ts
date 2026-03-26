import { saveBookmarks, loadBookmarks } from '@/lib/storage';
import { Bookmark } from '@/types/bookmark';

const sampleBookmark: Bookmark = {
  id: '1',
  url: 'https://example.com',
  title: 'Example',
  tags: ['test'],
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('localStorage storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe('saveBookmarks', () => {
    it('saves an array of bookmarks to localStorage', () => {
      saveBookmarks([sampleBookmark]);
      const raw = localStorage.getItem('bookmarks');
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!)).toEqual([sampleBookmark]);
    });

    it('saves an empty array', () => {
      saveBookmarks([]);
      const raw = localStorage.getItem('bookmarks');
      expect(JSON.parse(raw!)).toEqual([]);
    });

    it('does not throw if localStorage.setItem throws', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveBookmarks([sampleBookmark])).not.toThrow();
    });
  });

  describe('loadBookmarks', () => {
    it('returns empty array when localStorage is empty', () => {
      expect(loadBookmarks()).toEqual([]);
    });

    it('returns saved bookmarks', () => {
      localStorage.setItem('bookmarks', JSON.stringify([sampleBookmark]));
      expect(loadBookmarks()).toEqual([sampleBookmark]);
    });

    it('returns empty array for corrupted JSON', () => {
      localStorage.setItem('bookmarks', 'not-valid-json{{{');
      expect(loadBookmarks()).toEqual([]);
    });

    it('returns empty array if stored value is not an array', () => {
      localStorage.setItem('bookmarks', JSON.stringify({ id: '1' }));
      expect(loadBookmarks()).toEqual([]);
    });

    it('does not throw if localStorage.getItem throws', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(loadBookmarks()).toEqual([]);
    });
  });
});
