'use client';

import { useState } from 'react';
import { Bookmark } from '@/types/bookmark';

type BookmarkInput = Omit<Bookmark, 'id'>;
type FormErrors = { url?: string; title?: string };

interface BookmarkFormProps {
  onSubmit: (bookmark: BookmarkInput) => void;
}

export default function BookmarkForm({ onSubmit }: BookmarkFormProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!url.trim()) newErrors.url = 'URL is required';
    if (!title.trim()) newErrors.title = 'Title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      url: url.trim(),
      title: title.trim(),
      tags: parsedTags,
      createdAt: new Date().toISOString(),
    });

    setUrl('');
    setTitle('');
    setTags('');
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="url">URL</label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-describedby={errors.url ? 'url-error' : undefined}
        />
        {errors.url && <span id="url-error" role="alert">{errors.url}</span>}
      </div>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && <span id="title-error" role="alert">{errors.title}</span>}
      </div>
      <div>
        <label htmlFor="tags">Tags (optional, comma-separated)</label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <button type="submit">Add Bookmark</button>
    </form>
  );
}
