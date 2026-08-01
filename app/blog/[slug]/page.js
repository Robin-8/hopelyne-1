'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './page.module.css';

export default function BlogDetail() {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  
  useEffect(() => {
    if (params?.slug) {
      fetch(`/api/blog/${params.slug}`).then(r => r.json()).then(d => setBlog(d));
    }
  }, [params?.slug]);

  if (!blog) return <main className={styles.main}><p style={{textAlign:'center', marginTop:'4rem'}}>Loading...</p></main>;

  const readingTime = Math.ceil((blog.content || '').split(' ').length / 200) + ' min read';

  return (
    <main className={styles.main}>
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{blog.title}</h1>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.meta}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{blog.author?.name || 'Admin'}</span>
            <span className={styles.date}>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
            <span className={styles.readingTime}>{readingTime}</span>
          </div>
        </div>
        
        {blog.tags && (
          <div className={styles.tagsRow}>
            {blog.tags.split(',').map(tag => (
              <span key={tag} className={styles.badge}>{tag.trim()}</span>
            ))}
          </div>
        )}
        
        <div className={styles.content}>
          {(blog.content || '').split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        <div className={styles.footer}>
          <Link href="/blog" className={styles.back}>← Back to Blog</Link>
        </div>
      </div>
    </main>
  );
}
