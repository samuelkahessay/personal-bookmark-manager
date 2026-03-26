'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from '@/types/bookmark';
import { loadBookmarks, saveBookmarks } from '@/lib/storage';
import { filterBookmarks } from '@/lib/filter';
import BookmarkForm from '@/components/BookmarkForm';
import BookmarkList from '@/components/BookmarkList';
import SearchBar from '@/components/SearchBar';

type BookmarkInput = Omit<Bookmark, 'id'>;

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setBookmarks(loadBookmarks());
  }, []);

  function handleAdd(input: BookmarkInput) {
    const newBookmark: Bookmark = {
      ...input,
      id: crypto.randomUUID(),
    };
    const updated = [...bookmarks, newBookmark];
    setBookmarks(updated);
    saveBookmarks(updated);
  }

  function handleDelete(id: string) {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    saveBookmarks(updated);
  }

  const filteredBookmarks = filterBookmarks(bookmarks, searchQuery);

  return (
    <main>
      <h1>Personal Bookmark Manager</h1>
      <BookmarkForm onSubmit={handleAdd} />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <BookmarkList bookmarks={filteredBookmarks} onDelete={handleDelete} />
    </main>
  );
}
