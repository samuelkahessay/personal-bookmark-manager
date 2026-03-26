import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  it('renders a search input', () => {
    render(<SearchBar value="" onChange={jest.fn()} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<SearchBar value="react" onChange={jest.fn()} />);
    expect(screen.getByRole('searchbox')).toHaveValue('react');
  });

  it('calls onChange with new value as user types', () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'next' } });
    expect(onChange).toHaveBeenCalledWith('next');
  });

  it('has accessible label', () => {
    render(<SearchBar value="" onChange={jest.fn()} />);
    expect(screen.getByLabelText(/search bookmarks/i)).toBeInTheDocument();
  });
});
