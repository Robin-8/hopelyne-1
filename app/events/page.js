'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState('UPCOMING');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(d => {
        setEvents(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = events.filter(e => e.type === tab);

  const getCountdown = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return 'Past';
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Events</h1>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${tab === 'UPCOMING' ? styles.active : ''}`} 
          onClick={() => setTab('UPCOMING')}
        >
          Upcoming Events
        </button>
        <button 
          className={`${styles.tab} ${tab === 'PAST' ? styles.active : ''}`} 
          onClick={() => setTab('PAST')}
        >
          Past Events
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', width: '100%' }}>Loading events...</p>
      ) : (
        <div className={styles.grid}>
          {filtered.length ? filtered.map(e => {
            const d = new Date(e.date);
            return (
              <Link href={`/events/${e.id}`} key={e.id} className={styles.cardLink}>
                <div className={styles.card}>
                  <div className={styles.cardImage}>
                    <div className={styles.dateBadge}>
                      <div className={styles.month}>{d.toLocaleString('default', { month: 'short' })}</div>
                      <div className={styles.day}>{d.getDate()}</div>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.metaInfo}>
                      <span className={styles.timeInfo}>⏰ {e.time || 'TBA'}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{e.title}</h3>
                    <div className={styles.venue}>📍 {e.venue || 'TBA'}</div>
                    <p className={styles.desc}>{e.description}</p>
                    
                    <div className={styles.cardFooter}>
                      {tab === 'UPCOMING' ? (
                        <span className={styles.indicatorBadge}>⏳ {getCountdown(e.date)}</span>
                      ) : (
                        <span className={styles.indicatorBadge}>📖 View Recap</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          }) : (
            <p style={{textAlign: 'center', width: '100%', gridColumn: '1/-1'}}>No {tab.toLowerCase()} events found.</p>
          )}
        </div>
      )}
    </main>
  );
}
