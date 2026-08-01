'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../events/editor.module.css'; // Reuse form styles

export default function NewTeamMember() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', role: '', bio: '', photoUrl: '', linkedinUrl: '', twitterUrl: '', instagramUrl: '', order: 0 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) router.push('/admin/team');
      else alert('Failed to add member');
    } catch (e) {
      alert('Error adding member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Team Member</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Name</label>
          <input className={styles.input} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Role</label>
          <input className={styles.input} required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Bio</label>
          <textarea className={styles.textarea} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Photo URL</label>
          <input className={styles.input} value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>LinkedIn URL</label>
          <input className={styles.input} value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Twitter URL</label>
          <input className={styles.input} value={formData.twitterUrl} onChange={e => setFormData({...formData, twitterUrl: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Instagram URL</label>
          <input className={styles.input} value={formData.instagramUrl} onChange={e => setFormData({...formData, instagramUrl: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Display Order</label>
          <input type="number" className={styles.input} value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Member'}</button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}