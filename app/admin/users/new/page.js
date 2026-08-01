'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../events/editor.module.css';

export default function NewUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', roles: [] });
  const [loading, setLoading] = useState(false);

  const availableRoles = ['BLOG_MODERATOR', 'FORUM_MODERATOR', 'EVENTS_MODERATOR', 'SUPER_ADMIN'];

  const handleRoleToggle = (role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role) ? prev.roles.filter(r => r !== role) : [...prev.roles, role]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) router.push('/admin/users');
      else alert('Failed to add user');
    } catch (e) {
      alert('Error adding user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add User</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Name</label>
          <input className={styles.input} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input type="email" className={styles.input} required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input type="password" className={styles.input} required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Roles</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {availableRoles.map(role => (
              <label key={role} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" checked={formData.roles.includes(role)} onChange={() => handleRoleToggle(role)} />
                {role}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save User'}</button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}