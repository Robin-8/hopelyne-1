'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../../events/editor.module.css';

export default function EditResource() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', description: '', url: '', type: 'ARTICLE', thumbnailUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/resources/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            url: data.url || '',
            type: data.type || 'ARTICLE',
            thumbnailUrl: data.thumbnailUrl || ''
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        url: formData.url.trim(),
        type: formData.type,
        thumbnailUrl: formData.thumbnailUrl.trim() || undefined,
      };

      const res = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push('/admin/resources');
      } else {
        const msg = data.details?.join(', ') || data.error || 'Failed to update resource';
        setError(msg);
        alert(msg);
      }
    } catch (err) {
      const msg = err.message || 'Error updating resource';
      setError(msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading resource...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Resource</h1>
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
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>URL</label>
          <input
            className={styles.input}
            required
            value={formData.url}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Type</label>
          <select className={styles.select} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
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
            onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
          />
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Update Resource'}</button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
