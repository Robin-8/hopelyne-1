'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function TeamAdmin() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team').then(res => res.json()).then(data => {
      setMembers(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this team member?')) return;
    try {
      await fetch(`/api/team/${id}`, { method: 'DELETE' });
      setMembers(members.filter(m => m.id !== id));
    } catch (e) {
      alert('Error deleting member');
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Team Management</h1>
        <button className="btn btn-primary" onClick={() => window.location.href='/admin/team/new'}>Add Member</button>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className={styles.grid}>
          {members.map(member => (
            <div key={member.id} className={styles.card}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={member.photoUrl || '/avatar.png'} alt={member.name} className={styles.photo} />
              <h3 className={styles.name}>{member.name}</h3>
              <div className={styles.role}>{member.role}</div>
              <div className={styles.actions}>
                <button className={styles.btnEdit} onClick={() => window.location.href = `/admin/team/${member.id}`}>Edit</button>
                <button className={styles.btnDelete} onClick={() => handleDelete(member.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}