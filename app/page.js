'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const revealRefs = useRef([]);

  useEffect(() => {
    fetch('/api/blog?limit=3&status=PUBLISHED').then(r => r.json()).then(d => setBlogs(Array.isArray(d) ? d : []));
    fetch('/api/events?type=UPCOMING').then(r => r.json()).then(d => setEvents(Array.isArray(d) ? d : []));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.active);
        }
      });
    }, { threshold: 0.1 });

    revealRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const addToRefs = el => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Empowering Students. Building Resilience. Creating Hope.</h1>
        <p className={styles.subtitle}>A student-led awareness and wellness community dedicated to helping you navigate peer pressure, parental expectations, and life&apos;s challenges.</p>
        <div className={styles.ctaGroup}>
          <Link href="/contact" className={styles.btnPrimary}>Join the Community</Link>
          <Link href="/resources" className={styles.btnSecondary}>Explore Resources</Link>
        </div>
      </section>

      <section className={styles.statsGrid}>
        {[
          { label: 'Members', num: '50+' },
          { label: 'Blog Posts', num: '5' },
          { label: 'Events', num: '2' },
          { label: 'Resources', num: '10+' }
        ].map((s, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statNumber}>{s.num}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      <section className={`${styles.section} ${styles.reveal}`} ref={addToRefs}>
        <h2 className={styles.sectionTitle}>Featured Blogs</h2>
        <div className={styles.grid}>
          {blogs.length ? blogs.map(b => (
            <Link href={'/blog/' + b.slug} key={b.id} className={styles.card}>
              <div className={styles.cardImage}></div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{b.title}</h3>
                <p className={styles.cardText}>{b.excerpt}</p>
              </div>
            </Link>
          )) : <p>Loading blogs...</p>}
        </div>
      </section>
      
      <section className={`${styles.section} ${styles.reveal}`} ref={addToRefs}>
        <h2 className={styles.sectionTitle}>Upcoming Events</h2>
        <div className={styles.grid}>
          {events.length ? events.map(e => (
            <div key={e.id} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{e.title}</h3>
                <p className={styles.cardText}>{new Date(e.date).toLocaleDateString()}</p>
              </div>
            </div>
          )) : <p>Loading events...</p>}
        </div>
      </section>
    </main>
  );
}
