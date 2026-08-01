'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

export default function ForumThread() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [topic, setTopic] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const fetchTopic = async () => {
    try {
      const r = await fetch(`/api/forum/${id}`);
      const d = await r.json();
      setTopic(d);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTopic();
    }
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    try {
      const res = await fetch(`/api/forum/${id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent })
      });
      if (res.ok) {
        setReplyContent('');
        fetchTopic();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (replyId) => {
    if (!session) {
      alert("You must be logged in to like a reply.");
      return;
    }
    try {
      const res = await fetch(`/api/forum/${id}/replies/${replyId}/like`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchTopic();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!topic) return <main className={styles.main}><p className={styles.loading}>Loading topic...</p></main>;

  return (
    <main className={styles.main}>
      <Link href="/forum" className={styles.back}>← Back to Forum</Link>
      
      <div className={styles.op}>
        <div className={styles.opHeader}>
          <h1 className={styles.title}>{topic.title}</h1>
          <span className={styles.badgeCategory}>{topic.category}</span>
        </div>
        <div className={styles.meta}>
          <span className={styles.author}>By {topic.author?.name || 'Anonymous'}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.date}>{new Date(topic.createdAt).toLocaleString()}</span>
        </div>
        <div className={styles.content}>{topic.content}</div>
      </div>

      <div className={styles.repliesSection}>
        <h3 className={styles.repliesHeader}>{topic.replies?.length || 0} Replies</h3>
        
        <div className={styles.repliesList}>
          {topic.replies?.map(r => {
            const isLiked = session?.user && r.likes?.some(l => l.userId === session.user.id);
            return (
              <div key={r.id} className={styles.reply}>
                <div className={styles.replyHeader}>
                  <div className={styles.replyMeta}>
                    <span className={styles.replyAuthor}>{r.author?.name || 'Anonymous'}</span>
                    <span className={styles.dot}>•</span>
                    <span className={styles.replyDate}>{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className={styles.replyContent}>{r.content}</div>
                <div className={styles.replyActions}>
                  <button 
                    className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`} 
                    onClick={() => toggleLike(r.id)}
                    title={session ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
                  >
                    <span className={styles.heartIcon}>{isLiked ? '❤️' : '🤍'}</span>
                    <span className={styles.likeCount}>{r._count?.likes || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {session ? (
          <form className={styles.replyForm} onSubmit={handleReply}>
            <h3>Write a Reply</h3>
            <textarea 
              className={styles.textarea} 
              placeholder="Share your thoughts..." 
              value={replyContent} 
              onChange={e => setReplyContent(e.target.value)} 
              required 
              rows={4}
            />
            <button type="submit" className={styles.btnPrimary}>Post Reply</button>
          </form>
        ) : (
          <div className={styles.loginPrompt}>
            <p>Please <Link href="/login" className={styles.loginLink}>log in</Link> to reply to this topic.</p>
          </div>
        )}
      </div>
    </main>
  );
}
