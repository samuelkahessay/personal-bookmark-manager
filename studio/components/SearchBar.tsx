'use client';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="search"
      placeholder="Search bookmarks..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search bookmarks"
    />
  );
}
