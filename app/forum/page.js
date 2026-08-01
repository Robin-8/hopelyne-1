'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Peer Pressure', 'Parental Pressure', 'Self-Care & Wellness', 'Academic Stress', 'General Support'];

export default function ForumList() {
  const { data: session } = useSession();
  const [topics, setTopics] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [message, setMessage] = useState('');

  const fetchTopics = async () => {
    try {
      const r = await fetch('/api/forum?status=APPROVED');
      const d = await r.json();
      setTopics(Array.isArray(d) ? d : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const filteredTopics = activeTab === 'All' ? topics : topics.filter(t => t.category === activeTab);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category })
      });
      if (r.ok) {
        setMessage('Your topic has been submitted and is pending review.');
        setTitle('');
        setContent('');
        setShowForm(false);
      } else {
        setMessage('Failed to submit topic.');
      }
    } catch (err) {
      setMessage('An error occurred.');
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Discussion Forum</h1>
        {session ? (
          <button className={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Start a Discussion'}
          </button>
        ) : (
          <Link href="/login" className={styles.btnPrimary}>Login to Post</Link>
        )}
      </div>
      
      {message && <div className={styles.message}>{message}</div>}

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Start a New Discussion</h2>
          <input 
            type="text" 
            placeholder="Topic Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required
            className={styles.input}
          />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className={styles.input}
          >
            {CATEGORIES.slice(1).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <textarea 
            placeholder="Share your thoughts..." 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required
            className={styles.textarea}
            rows={5}
          ></textarea>
          <button type="submit" className={styles.btnPrimary}>Submit Topic</button>
        </form>
      )}

      <div className={styles.tabs}>
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            className={`${styles.tab} ${activeTab === cat ? styles.active : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filteredTopics.length > 0 ? filteredTopics.map(t => (
          <Link href={`/forum/${t.id}`} key={t.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{t.title}</h3>
              <span className={`${styles.badge} ${styles.badgeCategory}`}>{t.category}</span>
            </div>
            <div className={styles.cardMeta}>
              <span>By {t.author?.name || 'Anonymous'}</span>
              <span>•</span>
              <span>{new Date(t.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{t._count?.replies || 0} Replies</span>
              <span>•</span>
              <span className={styles.badgeStatus}>{t.status}</span>
            </div>
          </Link>
        )) : <div className={styles.empty}>No topics found in this category.</div>}
      </div>
    </main>
  );
}
