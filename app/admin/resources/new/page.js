'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../events/editor.module.css';

export default function NewResource() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', description: '', url: '', type: 'ARTICLE', thumbnailUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        url: formData.url.trim(),
        type: formData.type,
        thumbnailUrl: formData.thumbnailUrl.trim() || undefined,
      };

      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push('/admin/resources');
      } else {
        const msg = data.details?.join(', ') || data.error || 'Failed to add resource';
        setError(msg);
        alert(msg);
      }
    } catch (err) {
      const msg = err.message || 'Error adding resource';
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Resource</h1>
      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#FEE2E2',
          border: '1px solid #EF4444',
          color: '#B91C1C',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 500
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            placeholder="e.g. Self-Care for Students"
            required
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            placeholder="Brief overview of the resource..."
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>URL</label>
          <input
            className={styles.input}
            placeholder="https://www.youtube.com/watch?v=... or article link"
            required
            value={formData.url}
            onChange={e => setFormData({...formData, url: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Type</label>
          <select className={styles.select} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="ARTICLE">Article</option>
            <option value="BOOK">Book</option>
            <option value="YOUTUBE">YouTube</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Thumbnail URL (Optional)</label>
          <input
            className={styles.input}
            placeholder="https://example.com/thumbnail.jpg"
            value={formData.thumbnailUrl}
            onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
          />
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Resource'}</button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}