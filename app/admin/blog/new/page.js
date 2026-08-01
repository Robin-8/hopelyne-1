'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../editor.module.css';

export default function NewBlogPost() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', content: '', excerpt: '', tags: '', published: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      if (res.ok) router.push('/admin/blog');
      else alert('Failed to create post');
    } catch (e) {
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
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
          <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Post'}</button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}