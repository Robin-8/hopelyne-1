// Server Component — fully read-only blog detail page
import { getBlogPostByIdOrSlug } from '@/models/blogModel';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function BlogDetail({ params }) {
  const { slug } = await params;
  // Direct model access — no internal HTTP round-trip
  const blog = await getBlogPostByIdOrSlug(slug);

  if (!blog) notFound();

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
