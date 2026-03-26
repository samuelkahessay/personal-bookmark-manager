import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookmarkList from '@/components/BookmarkList';
import { Bookmark } from '@/types/bookmark';

const sampleBookmarks: Bookmark[] = [
  { id: '1', url: 'https://example.com', title: 'Example', tags: ['web', 'test'], createdAt: '2026-01-01T00:00:00Z' },
  { id: '2', url: 'https://another.com', title: 'Another', tags: [], createdAt: '2026-01-02T00:00:00Z' },
];

describe('BookmarkList', () => {
  it('displays a message when the bookmark list is empty', () => {
    render(<BookmarkList bookmarks={[]} onDelete={jest.fn()} />);
    expect(screen.getByText(/no bookmarks yet/i)).toBeInTheDocument();
  });

  it('renders each bookmark title', () => {
    render(<BookmarkList bookmarks={sampleBookmarks} onDelete={jest.fn()} />);
    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByText('Another')).toBeInTheDocument();
  });

  it('renders each bookmark URL as a clickable link', () => {
    render(<BookmarkList bookmarks={sampleBookmarks} onDelete={jest.fn()} />);
    const link = screen.getByRole('link', { name: 'Example' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders tags for a bookmark', () => {
    render(<BookmarkList bookmarks={sampleBookmarks} onDelete={jest.fn()} />);
    expect(screen.getByText('web')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('renders a delete button for each bookmark', () => {
    render(<BookmarkList bookmarks={sampleBookmarks} onDelete={jest.fn()} />);
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it('calls onDelete with the correct id when delete is clicked', () => {
    const onDelete = jest.fn();
    render(<BookmarkList bookmarks={sampleBookmarks} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('renders bookmarks in a list element', () => {
    render(<BookmarkList bookmarks={sampleBookmarks} onDelete={jest.fn()} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBeGreaterThanOrEqual(2);
  });

  it('does not render tags list when a bookmark has no tags', () => {
    const noTagsBookmarks: Bookmark[] = [
      { id: '3', url: 'https://notags.com', title: 'No Tags', tags: [], createdAt: '2026-01-03T00:00:00Z' },
    ];
    render(<BookmarkList bookmarks={noTagsBookmarks} onDelete={jest.fn()} />);
    expect(screen.queryByRole('list', { name: /tags/i })).not.toBeInTheDocument();
  });
});
