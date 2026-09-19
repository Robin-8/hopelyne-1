'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function BlogListClient({ blogs, tags }) {
  const [activeTag, setActiveTag] = useState('All');

  const filteredBlogs = activeTag === 'All'
    ? blogs
    : blogs.filter(b => b.tags && b.tags.split(',').map(t => t.trim()).includes(activeTag));

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Our Blog</h1>
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${activeTag === 'All' ? styles.active : ''}`}
          onClick={() => setActiveTag('All')}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            className={`${styles.filterBtn} ${activeTag === tag ? styles.active : ''}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ')}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {filteredBlogs.length ? filteredBlogs.map(b => (
          <Link href={`/blog/${b.slug}`} key={b.id} className={styles.card}>
            <div className={styles.image}></div>
            <div className={styles.content}>
              <div className={styles.cardTags}>
                {b.tags && b.tags.split(',').map(t => (
                  <span key={t} className={styles.cardTag}>{t.trim()}</span>
                ))}
              </div>
              <h3 className={styles.cardTitle}>{b.title}</h3>
              <p className={styles.excerpt}>{b.excerpt}</p>
              <div className={styles.meta}>
                <span>{b.author?.name || 'Admin'}</span>
                <span>{new Date(b.publishedAt || b.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        )) : <p style={{textAlign: 'center', width: '100%'}}>No blog posts found.</p>}
      </div>
    </main>
  );
}
