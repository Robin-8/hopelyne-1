'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ blog: 0, forum: 0, events: 0, team: 0, resources: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/blog').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
      fetch('/api/forum?status=PENDING').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
      fetch('/api/events?type=UPCOMING').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
      fetch('/api/team').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
      fetch('/api/resources').then(r => r.json()).then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
    ]).then(([blog, forum, events, team, resources]) => {
      setStats({ blog, forum, events, team, resources });
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{padding: 'var(--space-8)', textAlign: 'center'}}><div className="spinner" style={{margin: '0 auto'}}></div><p style={{marginTop: 'var(--space-4)'}}>Loading dashboard...</p></div>;

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.welcome}>Welcome back, {session?.user?.name || 'Admin'} 👋</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}><div className={styles.statIcon}>📝</div><div className={styles.statValue}>{stats.blog}</div><div className={styles.statLabel}>Blog Posts</div></div>
        <div className={styles.statCard}><div className={styles.statIcon}>💬</div><div className={styles.statValue}>{stats.forum}</div><div className={styles.statLabel}>Pending Topics</div></div>
        <div className={styles.statCard}><div className={styles.statIcon}>🗓️</div><div className={styles.statValue}>{stats.events}</div><div className={styles.statLabel}>Upcoming Events</div></div>
        <div className={styles.statCard}><div className={styles.statIcon}>👥</div><div className={styles.statValue}>{stats.team}</div><div className={styles.statLabel}>Team Members</div></div>
        <div className={styles.statCard}><div className={styles.statIcon}>📚</div><div className={styles.statValue}>{stats.resources}</div><div className={styles.statLabel}>Resources</div></div>
      </div>

      <h2 style={{marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-xl)'}}>Quick Actions</h2>
      <div className={styles.actions}>
        <Link href="/admin/blog/new" className="btn btn-primary">✏️ New Blog Post</Link>
        <Link href="/admin/events/new" className="btn btn-secondary">🗓️ New Event</Link>
        <Link href="/admin/forum" className="btn btn-outline">💬 Moderate Forum</Link>
        <Link href="/admin/team" className="btn btn-secondary">👥 Manage Team</Link>
        <Link href="/admin/resources" className="btn btn-secondary">📚 Manage Resources</Link>
      </div>
    </div>
  );
}