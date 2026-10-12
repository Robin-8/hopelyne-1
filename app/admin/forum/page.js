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
      setTopics(Array.isArray(data) ? data : []);
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
                <td>{typeof topic.category === 'object' ? (topic.category?.name || 'General') : (topic.category || 'General')}</td>
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