'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Resources() {
  const [resources, setResources] = useState([]);
  
  useEffect(() => {
    fetch('/api/resources').then(r => r.json()).then(d => setResources(Array.isArray(d) ? d : []));
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Useful Articles & Links</h1>
      <div className={styles.filters}>
        <button className={`${styles.filterBtn} ${styles.active}`}>All</button>
        <button className={styles.filterBtn}>Books</button>
        <button className={styles.filterBtn}>Articles</button>
        <button className={styles.filterBtn}>YouTube</button>
      </div>

      <div className={styles.grid}>
        {resources.length ? resources.map(r => (
          <div key={r.id} className={styles.card}>
            <div className={styles.badge}>{r.type}</div>
            <h3 className={styles.cardTitle}>{r.title}</h3>
            <p className={styles.desc}>{r.description}</p>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {r.type === 'YOUTUBE' ? 'Watch Video ↗' : 'Read More ↗'}
            </a>
          </div>
        )) : <p style={{textAlign: 'center', width: '100%', gridColumn: '1/-1'}}>Loading resources...</p>}
      </div>
    </main>
  );
}
