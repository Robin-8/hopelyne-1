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

  useEffect(() => {
    fetch(`/api/blog/${id}`).then(res => res.json()).then(data => {
      setFormData({
        title: data.title || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        tags: data.tags ? data.tags.map(t => t.name).join(', ') : '',
        published: data.published || false
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      if (res.ok) router.push('/admin/blog');
      else alert('Failed to update post');
    } catch (e) {
      alert('Error updating post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
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