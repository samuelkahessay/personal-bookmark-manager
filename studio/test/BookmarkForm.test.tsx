import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookmarkForm from '@/components/BookmarkForm';

describe('BookmarkForm', () => {
  it('renders URL, title, and tags inputs', () => {
    render(<BookmarkForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText('URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    render(<BookmarkForm onSubmit={jest.fn()} />);
    expect(screen.getByRole('button', { name: /add bookmark/i })).toBeInTheDocument();
  });

  it('shows validation error when URL is empty on submit', async () => {
    render(<BookmarkForm onSubmit={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'My Title' } });
    fireEvent.submit(screen.getByLabelText('Title').closest('form')!);
    await waitFor(() => {
      expect(screen.getByText('URL is required')).toBeInTheDocument();
    });
  });

  it('shows validation error when title is empty on submit', async () => {
    render(<BookmarkForm onSubmit={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com' } });
    fireEvent.submit(screen.getByLabelText('URL').closest('form')!);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Title is required');
    });
  });

  it('does not call onSubmit when fields are invalid', () => {
    const onSubmit = jest.fn();
    render(<BookmarkForm onSubmit={onSubmit} />);
    fireEvent.submit(screen.getByLabelText('URL').closest('form')!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct data when form is valid', async () => {
    const onSubmit = jest.fn();
    render(<BookmarkForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Example' } });
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'react, typescript' } });
    fireEvent.submit(screen.getByLabelText('URL').closest('form')!);
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://example.com',
          title: 'Example',
          tags: ['react', 'typescript'],
        })
      );
    });
  });

  it('clears form fields after successful submission', async () => {
    render(<BookmarkForm onSubmit={jest.fn()} />);
    const urlInput = screen.getByLabelText('URL');
    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    fireEvent.change(titleInput, { target: { value: 'Example' } });
    fireEvent.submit(urlInput.closest('form')!);
    await waitFor(() => {
      expect(urlInput).toHaveValue('');
      expect(titleInput).toHaveValue('');
    });
  });

  it('passes empty tags array when tags input is blank', async () => {
    const onSubmit = jest.fn();
    render(<BookmarkForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Example' } });
    fireEvent.submit(screen.getByLabelText('URL').closest('form')!);
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ tags: [] })
      );
    });
  });
});
