'use client';

import { Bookmark } from '@/types/bookmark';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
}

export default function BookmarkList({ bookmarks, onDelete }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return <p>No bookmarks yet. Add one above!</p>;
  }

  return (
    <ul>
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id}>
          <div>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
              {bookmark.title}
            </a>
            {bookmark.tags.length > 0 && (
              <ul aria-label="tags">
                {bookmark.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={() => onDelete(bookmark.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
