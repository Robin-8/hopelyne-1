import os

base_dir = "/Users/mahroofnm/.gemini/antigravity/scratch/hopelyne"

files = {
    "app/admin/blog/page.module.css": """
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
    "app/admin/blog/page.js": """
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog').then(res => res.json()).then(data => {
      setPosts(data.posts || []);
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
""",
    "app/admin/blog/editor.module.css": """
.form { display: flex; flex-direction: column; gap: 1.5rem; max-width: 800px; }
.formGroup { display: flex; flex-direction: column; gap: 0.5rem; }
.label { font-weight: 600; color: var(--text-primary); }
.input, .textarea, .select { padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--text-primary); }
.textarea { min-height: 150px; resize: vertical; }
.textareaLarge { min-height: 300px; }
.actions { display: flex; gap: 1rem; margin-top: 1rem; }
""",
    "app/admin/blog/new/page.js": """
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../editor.module.css';

export default function NewBlogPost() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', content: '', excerpt: '', tags: '', published: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      if (res.ok) router.push('/admin/blog');
      else alert('Failed to create post');
    } catch (e) {
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Excerpt</label>
          <textarea className={styles.textarea} required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Content</label>
          <textarea className={`${styles.textarea} ${styles.textareaLarge}`} required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tags (comma separated)</label>
          <input className={styles.input} value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Status</label>
          <select className={styles.select} value={formData.published} onChange={e => setFormData({...formData, published: e.target.value === 'true'})}>
            <option value="false">Draft</option>
            <option value="true">Published</option>
          </select>
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Post'}</button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
""",
    "app/admin/blog/[id]/edit/page.js": """
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../editor.module.css';

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', content: '', excerpt: '', tags: '', published: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${id}`).then(res => res.json()).then(data => {
      setFormData({
        title: data.title || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        tags: data.tags ? data.tags.map(t => t.name).join(', ') : '',
        published: data.published || false
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      if (res.ok) router.push('/admin/blog');
      else alert('Failed to update post');
    } catch (e) {
      alert('Error updating post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Excerpt</label>
          <textarea className={styles.textarea} required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Content</label>
          <textarea className={`${styles.textarea} ${styles.textareaLarge}`} required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tags (comma separated)</label>
          <input className={styles.input} value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Status</label>
          <select className={styles.select} value={formData.published} onChange={e => setFormData({...formData, published: e.target.value === 'true'})}>
            <option value="false">Draft</option>
            <option value="true">Published</option>
          </select>
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Update Post'}</button>
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
print("Blog admin written.")
