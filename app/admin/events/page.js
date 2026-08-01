'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events').then(res => res.json()).then(data => {
      setEvents(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      setEvents(events.filter(e => e.id !== id));
    } catch (e) {
      alert('Error deleting event');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Event Management</h1>
        <Link href="/admin/events/new" className="btn btn-primary">New Event</Link>
      </div>
      {loading ? <p>Loading...</p> : (
        <table className={styles.table}>
          <thead><tr><th>Title</th><th>Date</th><th>Venue</th><th>Type</th><th>Actions</th></tr></thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.venue}</td>
                <td><span className="badge">{event.type}</span></td>
                <td className={styles.actions}>
                  <Link href={`/admin/events/${event.id}/edit`} className={styles.actionBtn}>Edit</Link>
                  <button onClick={() => handleDelete(event.id)} className={styles.actionBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}