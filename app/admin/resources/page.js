'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function ResourcesAdmin() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resources').then(res => res.json()).then(data => {
      setResources(Array.isArray(data) ? data : []);
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
        <button className="btn btn-primary" onClick={() => window.location.href='/admin/resources/new'}>Add Resource</button>
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