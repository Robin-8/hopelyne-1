'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../events/editor.module.css';

export default function NewResource() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', description: '', url: '', type: 'ARTICLE', thumbnailUrl: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) router.push('/admin/resources');
      else alert('Failed to add resource');
    } catch (e) {
      alert('Error adding resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Resource</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>URL</label>
          <input className={styles.input} required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
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
          <label className={styles.label}>Thumbnail URL</label>
          <input className={styles.input} value={formData.thumbnailUrl} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} />
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Resource'}</button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}