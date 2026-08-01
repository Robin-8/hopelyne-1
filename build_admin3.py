import os

base_dir = "/Users/mahroofnm/.gemini/antigravity/scratch/hopelyne"

files = {
    "app/admin/forum/page.module.css": """
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.title { font-size: 2rem; color: var(--text-primary); }
.tabs { display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
.tab { background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.5rem 1rem; font-size: 1rem; }
.tab.active { color: var(--primary); font-weight: bold; border-bottom: 2px solid var(--primary); }
.table { width: 100%; border-collapse: collapse; background: var(--surface); border-radius: 8px; overflow: hidden; }
.table th, .table td { padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
.table th { background: rgba(255,255,255,0.02); color: var(--text-secondary); font-weight: 600; }
.table tr:hover { background: rgba(255,255,255,0.02); }
.actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.btnApprove { color: #4caf50; background: none; border: none; cursor: pointer; }
.btnReject { color: #f44336; background: none; border: none; cursor: pointer; }
.btnView { color: var(--primary); background: none; border: none; cursor: pointer; }
.panel { background: rgba(255,255,255,0.05); padding: 1rem; margin-top: 1rem; border-radius: 8px; }
.replyItem { padding: 1rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; }
""",
    "app/admin/forum/page.js": """
'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function ForumAdmin() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [viewingReplies, setViewingReplies] = useState(null);

  useEffect(() => {
    fetch('/api/forum?all=true').then(res => res.json()).then(data => {
      setTopics(data.topics || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await fetch(`/api/forum/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setTopics(topics.map(t => t.id === id ? { ...t, status } : t));
    } catch (e) {
      alert('Error updating status');
    }
  };

  const handleDeleteTopic = async (id) => {
    if (!confirm('Delete this topic?')) return;
    try {
      await fetch(`/api/forum/${id}`, { method: 'DELETE' });
      setTopics(topics.filter(t => t.id !== id));
    } catch (e) {
      alert('Error deleting topic');
    }
  };

  const handleDeleteReply = async (topicId, replyId) => {
    if (!confirm('Delete this reply?')) return;
    try {
      await fetch(`/api/forum/${topicId}/replies/${replyId}`, { method: 'DELETE' });
      setViewingReplies(viewingReplies.filter(r => r.id !== replyId));
    } catch (e) {
      alert('Error deleting reply');
    }
  };

  const loadReplies = async (id) => {
    if (viewingReplies && viewingReplies.topicId === id) {
      setViewingReplies(null);
      return;
    }
    const res = await fetch(`/api/forum/${id}`);
    const data = await res.json();
    const replies = data.replies || [];
    replies.topicId = id;
    setViewingReplies(replies);
  };

  const filteredTopics = topics.filter(t => t.status === activeTab);

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Forum Moderation</h1>
      </div>
      
      <div className={styles.tabs}>
        {['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'].map(tab => (
          <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? <p>Loading...</p> : (
        <table className={styles.table}>
          <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Date</th><th>Replies</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredTopics.map(topic => (
              <tr key={topic.id}>
                <td>{topic.title}</td>
                <td>{topic.category?.name || 'General'}</td>
                <td>{topic.author?.name || 'Unknown'}</td>
                <td>{new Date(topic.createdAt).toLocaleDateString()}</td>
                <td>{topic._count?.replies || 0}</td>
                <td className={styles.actions}>
                  {activeTab === 'PENDING' && (
                    <>
                      <button onClick={() => handleStatusUpdate(topic.id, 'APPROVED')} className={styles.btnApprove}>Approve</button>
                      <button onClick={() => handleStatusUpdate(topic.id, 'REJECTED')} className={styles.btnReject}>Reject</button>
                    </>
                  )}
                  {activeTab === 'APPROVED' && (
                    <button onClick={() => handleStatusUpdate(topic.id, 'COMPLETED')} className={styles.btnApprove}>Complete</button>
                  )}
                  <button onClick={() => loadReplies(topic.id)} className={styles.btnView}>Replies</button>
                  <button onClick={() => handleDeleteTopic(topic.id)} className={styles.btnReject}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {viewingReplies && (
        <div className={styles.panel}>
          <h3 className="font-bold mb-4">Replies</h3>
          {viewingReplies.length === 0 ? <p>No replies yet.</p> : viewingReplies.map(reply => (
            <div key={reply.id} className={styles.replyItem}>
              <div>
                <strong>{reply.author?.name}</strong>: {reply.content}
              </div>
              <button onClick={() => handleDeleteReply(viewingReplies.topicId, reply.id)} className={styles.btnReject}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
""",
    "app/admin/events/page.module.css": """
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
    "app/admin/events/page.js": """
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events').then(res => res.json()).then(data => {
      setEvents(data.events || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      setEvents(events.filter(e => e.id !== id));
    } catch (e) {
      alert('Error deleting event');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Event Management</h1>
        <Link href="/admin/events/new" className="btn btn-primary">New Event</Link>
      </div>
      {loading ? <p>Loading...</p> : (
        <table className={styles.table}>
          <thead><tr><th>Title</th><th>Date</th><th>Venue</th><th>Type</th><th>Actions</th></tr></thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.venue}</td>
                <td><span className="badge">{event.type}</span></td>
                <td className={styles.actions}>
                  <Link href={`/admin/events/${event.id}/edit`} className={styles.actionBtn}>Edit</Link>
                  <button onClick={() => handleDelete(event.id)} className={styles.actionBtn}>Delete</button>
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
print("Forum and Events admin written.")
