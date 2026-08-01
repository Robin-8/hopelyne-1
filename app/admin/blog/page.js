'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog').then(res => res.json()).then(data => {
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p.id !== id));
    } catch (e) {
      alert('Error deleting post');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog Management</h1>
        <Link href="/admin/blog/new" className="btn btn-primary">New Post</Link>
      </div>
      {loading ? <p>Loading...</p> : (
        <table className={styles.table}>
          <thead><tr><th>Title</th><th>Status</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td><span className={`badge ${post.published ? 'badge-success' : 'badge-warning'}`}>{post.published ? 'Published' : 'Draft'}</span></td>
                <td>{post.author?.name || 'Unknown'}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className={styles.actions}>
                  <Link href={`/admin/blog/${post.id}/edit`} className={styles.actionBtn}>Edit</Link>
                  <button onClick={() => handleDelete(post.id)} className={styles.actionBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}