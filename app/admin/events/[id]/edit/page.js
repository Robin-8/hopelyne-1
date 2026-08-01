'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../editor.module.css';

export default function EditEvent() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', venue: '', meetingLink: '', type: 'UPCOMING', recap: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${id}`).then(res => res.json()).then(data => {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        time: data.time || '',
        venue: data.venue || '',
        meetingLink: data.meetingLink || '',
        type: data.type || 'UPCOMING',
        recap: data.recap || ''
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) router.push('/admin/events');
      else alert('Failed to update event');
    } catch (e) {
      alert('Error updating event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label className={styles.label}>Date</label>
            <input type="date" className={styles.input} required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label className={styles.label}>Time</label>
            <input type="time" className={styles.input} required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Venue</label>
          <input className={styles.input} required value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Meeting Link (Optional)</label>
          <input type="url" className={styles.input} value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} placeholder="https://..." />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Type</label>
          <select className={styles.select} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="UPCOMING">Upcoming</option>
            <option value="PAST">Past</option>
          </select>
        </div>
        {formData.type === 'PAST' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Recap</label>
            <textarea className={styles.textarea} value={formData.recap} onChange={e => setFormData({...formData, recap: e.target.value})} />
          </div>
        )}
        <div className={styles.actions}>
          <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Update Event'}</button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}