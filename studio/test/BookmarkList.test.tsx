import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookmarkList from '@/components/BookmarkList';
import { Bookmark } from '@/types/bookmark';

const sampleBookmarks: Bookmark[] = [
  { id: '1', url: 'https://example.com', title: 'Example', tags: ['react', 'typescript'], createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', url: 'https://openai.com', title: 'OpenAI', tags: [], createdAt: '2024-01-02T00:00:00Z' },
];

describe('BookmarkList', () => {
  it('renders empty state message when no bookmarks', () => {
    render(<BookmarkList bookmarks={[]} onDelete={jest.fn()} />);
    expect(screen.getByText(/no bookmarks yet/i)).toBeInTheDocument();
  });

  it('renders a list item for each bookmark', () => {
    render(<BookmarkList bookmarks={sampleBookmarks} onDelete={jest.fn()} />);
    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
  });

  it('renders bookmark URL as a clickable link opening in new tab', () => {
    render(<BookmarkList bookmarks={sampleBookmarks} onDelete={jest.fn()} />);
    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders tags for bookmarks that have them', () => {
    render(<BookmarkList bookmarks={sampleBookmarks} onDelete={jest.fn()} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('does not render tags list when bookmark has no tags', () => {
    render(<BookmarkList bookmarks={[sampleBookmarks[1]]} onDelete={jest.fn()} />);
    expect(screen.queryByLabelText('tags')).not.toBeInTheDocument();
  });

  it('renders a delete button for each bookmark', () => {
    render(<BookmarkList bookmarks={sampleBookmarks} onDelete={jest.fn()} />);
    expect(screen.getByRole('button', { name: /delete example/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete openai/i })).toBeInTheDocument();
  });

  it('calls onDelete with the correct bookmark id when delete is clicked', () => {
    const onDelete = jest.fn();
    render(<BookmarkList bookmarks={sampleBookmarks} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete example/i }));
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('does not call onDelete when a different delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<BookmarkList bookmarks={sampleBookmarks} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete openai/i }));
    expect(onDelete).toHaveBeenCalledWith('2');
    expect(onDelete).not.toHaveBeenCalledWith('1');
  });
});
