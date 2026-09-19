'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

export default function EventDetail() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Attendance state
  const [attending, setAttending] = useState(false);
  const [attendCount, setAttendCount] = useState(0);
  const [attendingLoading, setAttendingLoading] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [commentContent, setCommentContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Declared before useEffect to satisfy react-hooks linting rules
  const fetchEvent = useCallback(() => {
    fetch(`/api/events/${id}`)
      .then(r => r.json())
      .then(d => {
        setEvent(d);
        if (d && d._count) {
          setAttendCount(d._count.attendances || 0);
        }
        if (d && d.attendances && session?.user?.id) {
          const userAtt = d.attendances.find(a => a.userId === session.user.id);
          setAttending(userAtt ? userAtt.attending : false);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleToggleAttendance = async () => {
    if (!session) return alert("Please log in to RSVP.");
    setAttendingLoading(true);
    try {
      const res = await fetch(`/api/events/${id}/attend`, { method: 'POST' });
      const data = await res.json();
      setAttending(data.attending);
      setAttendCount(data.attendanceCount);
    } catch (e) {
      console.error(e);
    }
    setAttendingLoading(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!session) return alert('Please log in to leave a review.');
    if (!commentContent.trim()) return;
    
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/events/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentContent,
          rating,
          userName: session.user.name,
        }),
      });
      if (res.ok) {
        const newComment = await res.json();
        // Append new comment to local state — no full event refetch needed
        setEvent(prev => ({
          ...prev,
          comments: [newComment, ...(prev.comments || [])],
        }));
        setCommentContent('');
        setRating(5);
      }
    } catch (e) {
      console.error(e);
    }
    setSubmittingReview(false);
  };

  const renderStars = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  if (loading) return <main className={styles.main}><p style={{textAlign:'center'}}>Loading...</p></main>;
  if (!event) return <main className={styles.main}><p style={{textAlign:'center'}}>Event not found.</p></main>;

  const d = new Date(event.date);
  let gallery = [];
  try {
    if (event.gallery) gallery = JSON.parse(event.gallery);
  } catch(e) {}

  return (
    <main className={styles.main}>
      <Link href="/events" className={styles.backLink}>&larr; Back to Events</Link>
      
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.dateBadge}>
            <div className={styles.month}>{d.toLocaleString('default', { month: 'short' })}</div>
            <div className={styles.day}>{d.getDate()}</div>
            <div className={styles.year}>{d.getFullYear()}</div>
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.title}>{event.title}</h1>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>⏰ {event.time || 'TBA'}</span>
              <span className={styles.metaItem}>📍 {event.venue || 'TBA'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentLayout}>
        <div className={styles.mainColumn}>
          <section className={styles.section}>
            <h2>About the Event</h2>
            <p className={styles.description}>{event.description}</p>
          </section>

          {event.type === 'UPCOMING' && event.meetingLink && (
            <section className={styles.section}>
              <h2>Virtual Meeting Link</h2>
              <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className={styles.joinBtn}>
                Join Meeting
              </a>
            </section>
          )}

          {event.type === 'PAST' && (
            <>
              {event.recap && (
                <section className={styles.section}>
                  <h2>Event Recap</h2>
                  <p className={styles.recap}>{event.recap}</p>
                </section>
              )}

              {gallery.length > 0 && (
                <section className={styles.section}>
                  <h2>Gallery</h2>
                  <div className={styles.galleryGrid}>
                    {gallery.map((img, idx) => (
                      <div key={idx} className={styles.galleryItem}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Gallery image ${idx+1}`} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className={styles.section}>
                <h2>Reviews & Ratings</h2>
                <div className={styles.commentsList}>
                  {event.comments && event.comments.length > 0 ? (
                    event.comments.map(c => (
                      <div key={c.id} className={styles.commentCard}>
                        <div className={styles.commentHeader}>
                          <span className={styles.commentAuthor}>{c.userName}</span>
                          <span className={styles.commentDate}>{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        {c.rating && <div className={styles.commentRating}>{renderStars(c.rating)}</div>}
                        <p className={styles.commentContent}>{c.content}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>

                {session && (
                  <form className={styles.reviewForm} onSubmit={handleSubmitReview}>
                    <h3>Leave a Review</h3>
                    <div className={styles.ratingSelector}>
                      <span>Rating: </span>
                      {[1,2,3,4,5].map(num => (
                        <span 
                          key={num} 
                          className={styles.starSelect} 
                          onClick={() => setRating(num)}
                        >
                          {num <= rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <textarea 
                      className={styles.textarea}
                      placeholder="Share your thoughts about this event..."
                      value={commentContent}
                      onChange={e => setCommentContent(e.target.value)}
                      required
                      rows={4}
                    />
                    <button type="submit" className={styles.submitBtn} disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </section>
            </>
          )}
        </div>

        <div className={styles.sidebar}>
          {event.type === 'UPCOMING' && (
            <div className={styles.attendanceCard}>
              <h3>Attendance</h3>
              <p className={styles.attendCount}>
                <strong>{attendCount}</strong> {attendCount === 1 ? 'person is' : 'people are'} attending
              </p>
              
              <button 
                className={`${styles.attendanceToggle} ${attending ? styles.isAttending : ''}`}
                onClick={handleToggleAttendance}
                disabled={attendingLoading}
              >
                {attendingLoading ? 'Wait...' : (attending ? "I'm Attending ✓" : "RSVP")}
              </button>
              
              {!session && <p className={styles.loginPrompt}>Log in to RSVP</p>}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
