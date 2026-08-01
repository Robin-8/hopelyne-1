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
        setUsers(Array.isArray(data) ? data : []);
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
        <button className="btn btn-primary" onClick={() => window.location.href='/admin/users/new'}>Add User</button>
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