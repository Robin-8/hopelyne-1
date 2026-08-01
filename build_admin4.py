import os

base_dir = "/Users/mahroofnm/.gemini/antigravity/scratch/hopelyne"

files = {
    "app/admin/events/editor.module.css": """
.form { display: flex; flex-direction: column; gap: 1.5rem; max-width: 800px; }
.formGroup { display: flex; flex-direction: column; gap: 0.5rem; }
.label { font-weight: 600; color: var(--text-primary); }
.input, .textarea, .select { padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--text-primary); }
.textarea { min-height: 150px; resize: vertical; }
.actions { display: flex; gap: 1rem; margin-top: 1rem; }
""",
    "app/admin/events/new/page.js": """
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../editor.module.css';

export default function NewEvent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', venue: '', type: 'UPCOMING', recap: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) router.push('/admin/events');
      else alert('Failed to create event');
    } catch (e) {
      alert('Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
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
          <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Event'}</button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
""",
    "app/admin/events/[id]/edit/page.js": """
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../editor.module.css';

export default function EditEvent() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', venue: '', type: 'UPCOMING', recap: '' });
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
""",
    "app/admin/team/page.module.css": """
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.title { font-size: 2rem; color: var(--text-primary); }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
.card { background: var(--surface); border-radius: 12px; padding: 1.5rem; text-align: center; border: 1px solid var(--border); }
.photo { width: 100px; height: 100px; border-radius: 50%; background: #444; margin: 0 auto 1rem; object-fit: cover; }
.name { font-size: 1.25rem; font-weight: bold; color: var(--text-primary); margin-bottom: 0.25rem; }
.role { color: var(--primary); font-size: 0.9rem; margin-bottom: 1rem; }
.actions { display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 1rem; }
.btnEdit { color: var(--text-secondary); background: none; border: none; cursor: pointer; }
.btnDelete { color: #f44336; background: none; border: none; cursor: pointer; }
.btnEdit:hover, .btnDelete:hover { opacity: 0.8; }
""",
    "app/admin/team/page.js": """
'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function TeamAdmin() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team').then(res => res.json()).then(data => {
      setMembers(data.team || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this team member?')) return;
    try {
      await fetch(`/api/team/${id}`, { method: 'DELETE' });
      setMembers(members.filter(m => m.id !== id));
    } catch (e) {
      alert('Error deleting member');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Team Management</h1>
        <button className="btn btn-primary" onClick={() => alert('Add Member Form - To Be Implemented')}>Add Member</button>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className={styles.grid}>
          {members.map(member => (
            <div key={member.id} className={styles.card}>
              <img src={member.photoUrl || '/avatar.png'} alt={member.name} className={styles.photo} />
              <h3 className={styles.name}>{member.name}</h3>
              <div className={styles.role}>{member.role}</div>
              <div className={styles.actions}>
                <button className={styles.btnEdit} onClick={() => alert('Edit Member Form - To Be Implemented')}>Edit</button>
                <button className={styles.btnDelete} onClick={() => handleDelete(member.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"""
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content.strip() + "\\n")
print("Events, Team admin written.")
