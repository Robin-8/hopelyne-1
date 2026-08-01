import os

base_dir = "/Users/mahroofnm/.gemini/antigravity/scratch/hopelyne"

files = {
    "app/admin/resources/page.module.css": """
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.title { font-size: 2rem; color: var(--text-primary); }
.table { width: 100%; border-collapse: collapse; background: var(--surface); border-radius: 8px; overflow: hidden; }
.table th, .table td { padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
.table th { background: rgba(255,255,255,0.02); color: var(--text-secondary); font-weight: 600; }
.table tr:hover { background: rgba(255,255,255,0.02); }
.actions { display: flex; gap: 0.5rem; }
.actionBtn { background: none; border: none; cursor: pointer; color: var(--text-secondary); }
.actionBtn:hover { color: var(--primary); }
""",
    "app/admin/resources/page.js": """
'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function ResourcesAdmin() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resources').then(res => res.json()).then(data => {
      setResources(data.resources || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this resource?')) return;
    try {
      await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      setResources(resources.filter(r => r.id !== id));
    } catch (e) {
      alert('Error deleting resource');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Resources Management</h1>
        <button className="btn btn-primary" onClick={() => alert('Add Resource Form - To Be Implemented')}>Add Resource</button>
      </div>
      {loading ? <p>Loading...</p> : (
        <table className={styles.table}>
          <thead><tr><th>Title</th><th>Type</th><th>URL</th><th>Actions</th></tr></thead>
          <tbody>
            {resources.map(resource => (
              <tr key={resource.id}>
                <td>{resource.title}</td>
                <td><span className="badge">{resource.type}</span></td>
                <td><a href={resource.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Link</a></td>
                <td className={styles.actions}>
                  <button className={styles.actionBtn} onClick={() => alert('Edit form here')}>Edit</button>
                  <button className={styles.actionBtn} onClick={() => handleDelete(resource.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
""",
    "app/admin/users/page.module.css": """
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.title { font-size: 2rem; color: var(--text-primary); }
.table { width: 100%; border-collapse: collapse; background: var(--surface); border-radius: 8px; overflow: hidden; }
.table th, .table td { padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
.table th { background: rgba(255,255,255,0.02); color: var(--text-secondary); font-weight: 600; }
.table tr:hover { background: rgba(255,255,255,0.02); }
.roles { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.actions { display: flex; gap: 0.5rem; }
.actionBtn { background: none; border: none; cursor: pointer; color: var(--text-secondary); }
.actionBtn:hover { color: var(--primary); }
.error { color: #f44336; font-size: 1.2rem; text-align: center; margin-top: 2rem; }
""",
    "app/admin/users/page.js": """
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

export default function UsersAdmin() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.roles?.includes('SUPER_ADMIN')) {
      fetch('/api/users').then(res => res.json()).then(data => {
        setUsers(data.users || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleDelete = async (id) => {
    if (id === session.user.id) {
      alert("You cannot delete yourself.");
      return;
    }
    if (!confirm('Delete this user?')) return;
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== id));
    } catch (e) {
      alert('Error deleting user');
    }
  };

  if (!session?.user?.roles?.includes('SUPER_ADMIN')) {
    return <div className={styles.error}>Access Denied. Super Admin only.</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>User Management</h1>
        <button className="btn btn-primary" onClick={() => alert('Add User Form - To Be Implemented')}>Add User</button>
      </div>
      {loading ? <p>Loading...</p> : (
        <table className={styles.table}>
          <thead><tr><th>Name</th><th>Email</th><th>Roles</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <div className={styles.roles}>
                    {user.roles?.map(role => (
                      <span key={role} className="badge badge-accent" style={{ fontSize: '0.7rem' }}>{role}</span>
                    ))}
                  </div>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className={styles.actions}>
                  <button className={styles.actionBtn} onClick={() => alert('Edit User Form here')}>Edit</button>
                  <button className={styles.actionBtn} onClick={() => handleDelete(user.id)} disabled={user.id === session.user.id}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
print("Resources and Users admin written.")
