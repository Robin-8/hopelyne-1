'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../events/editor.module.css';

const SYSTEM_ROLES = [
  'SUPER_ADMIN',
  'BLOG_MODERATOR',
  'FORUM_MODERATOR',
  'EVENTS_MODERATOR',
  'MEMBER',
];

export default function NewTeamMember() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    photoUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelectChange = (e) => {
    const val = e.target.value;
    setSelectedRole(val);
    if (val === '__CUSTOM__') {
      setFormData(prev => ({ ...prev, role: customRole }));
    } else {
      setFormData(prev => ({ ...prev, role: val }));
    }
  };

  const handleCustomRoleChange = (e) => {
    const val = e.target.value;
    setCustomRole(val);
    setFormData(prev => ({ ...prev, role: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalRole = selectedRole === '__CUSTOM__' ? customRole.trim() : formData.role.trim();
    if (!finalRole) {
      alert('Please select or enter a role.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        role: finalRole,
        bio: formData.bio?.trim() || undefined,
        photoUrl: formData.photoUrl?.trim() || undefined,
        linkedinUrl: formData.linkedinUrl?.trim() || undefined,
        twitterUrl: formData.twitterUrl?.trim() || undefined,
        instagramUrl: formData.instagramUrl?.trim() || undefined,
      };

      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push('/admin/team');
      } else {
        const msg = data.details?.join(', ') || data.error || 'Failed to add member';
        setError(msg);
        alert(msg);
      }
    } catch (err) {
      const msg = err.message || 'Error adding member';
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Team Member</h1>
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
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            placeholder="e.g. John Doe"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Role</label>
          <select
            className={styles.select}
            value={selectedRole}
            onChange={handleRoleSelectChange}
            required
          >
            <option value="" disabled>-- Select a System Role --</option>
            {SYSTEM_ROLES.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
            <option value="__CUSTOM__">➕ Custom Role (type your own)...</option>
          </select>

          {selectedRole === '__CUSTOM__' && (
            <input
              type="text"
              className={styles.input}
              style={{ marginTop: '0.5rem' }}
              placeholder="Enter custom role title..."
              value={customRole}
              onChange={handleCustomRoleChange}
              required
              autoFocus
            />
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Bio</label>
          <textarea
            className={styles.textarea}
            placeholder="Brief bio or description about the team member..."
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Photo URL</label>
          <input
            className={styles.input}
            placeholder="https://example.com/avatar.jpg"
            value={formData.photoUrl}
            onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>LinkedIn URL</label>
          <input
            className={styles.input}
            placeholder="https://linkedin.com/in/username"
            value={formData.linkedinUrl}
            onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Twitter URL</label>
          <input
            className={styles.input}
            placeholder="https://twitter.com/username"
            value={formData.twitterUrl}
            onChange={e => setFormData({ ...formData, twitterUrl: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Instagram URL</label>
          <input
            className={styles.input}
            placeholder="https://instagram.com/username"
            value={formData.instagramUrl}
            onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Display Order</label>
          <input
            type="number"
            className={styles.input}
            value={formData.order}
            onChange={e => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : 'Save Member'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}