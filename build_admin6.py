import os

base_dir = "/Users/mahroofnm/.gemini/antigravity/scratch/hopelyne"

files = {
    "app/admin/team/new/page.js": """
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
""",
    "app/admin/resources/new/page.js": """
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
""",
    "app/admin/users/new/page.js": """
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
"""
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content.strip() + "\\n")
print("Additional forms written.")
