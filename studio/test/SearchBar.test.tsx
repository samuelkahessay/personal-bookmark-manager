import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  it('renders a search input', () => {
    render(<SearchBar value="" onChange={jest.fn()} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('renders the label "Search bookmarks"', () => {
    render(<SearchBar value="" onChange={jest.fn()} />);
    expect(screen.getByLabelText('Search bookmarks')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<SearchBar value="react" onChange={jest.fn()} />);
    expect(screen.getByRole('searchbox')).toHaveValue('react');
  });

  it('calls onChange with the new value when user types', () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'typescript' } });
    expect(onChange).toHaveBeenCalledWith('typescript');
  });

  it('calls onChange with empty string when input is cleared', () => {
    const onChange = jest.fn();
    render(<SearchBar value="react" onChange={onChange} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith('');
  });
});
