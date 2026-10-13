'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../editor.module.css';

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', content: '', excerpt: '', tags: '', published: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/blog/${id}`).then(res => res.json()).then(data => {
      setFormData({
        title: data.title || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        tags: typeof data.tags === 'string' ? data.tags : Array.isArray(data.tags) ? data.tags.join(', ') : '',
        published: data.status === 'PUBLISHED'
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean).join(',') : undefined,
        status: formData.published ? 'PUBLISHED' : 'DRAFT',
      };

      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push('/admin/blog');
      } else {
        const msg = data.details?.join(', ') || data.error || 'Failed to update post';
        setError(msg);
        alert(msg);
      }
    } catch (err) {
      const msg = err.message || 'Error updating post';
      setError(msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
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
          <input className={styles.input} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Excerpt</label>
          <textarea className={styles.textarea} required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Content</label>
          <textarea className={`${styles.textarea} ${styles.textareaLarge}`} required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tags (comma separated)</label>
          <input className={styles.input} value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Status</label>
          <select className={styles.select} value={formData.published} onChange={e => setFormData({...formData, published: e.target.value === 'true'})}>
            <option value="false">Draft</option>
            <option value="true">Published</option>
          </select>
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Update Post'}</button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}