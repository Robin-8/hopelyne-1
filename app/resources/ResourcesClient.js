'use client';

import { useState } from 'react';
import styles from './page.module.css';

const TYPES = ['All', 'BOOK', 'ARTICLE', 'YOUTUBE'];

export default function ResourcesClient({ resources }) {
  const [activeType, setActiveType] = useState('All');

  const filtered = activeType === 'All'
    ? resources
    : resources.filter(r => r.type === activeType);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Useful Articles & Links</h1>
      <div className={styles.filters}>
        {TYPES.map(type => (
          <button
            key={type}
            className={`${styles.filterBtn} ${activeType === type ? styles.active : ''}`}
            onClick={() => setActiveType(type)}
          >
            {type === 'All' ? 'All' : type.charAt(0) + type.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.length ? filtered.map(r => (
          <div key={r.id} className={styles.card}>
            <div className={styles.badge}>{r.type}</div>
            <h3 className={styles.cardTitle}>{r.title}</h3>
            <p className={styles.desc}>{r.description}</p>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {r.type === 'YOUTUBE' ? 'Watch Video ↗' : 'Read More ↗'}
            </a>
          </div>
        )) : <p style={{textAlign: 'center', width: '100%', gridColumn: '1/-1'}}>No resources found.</p>}
      </div>
    </main>
  );
}
