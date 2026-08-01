'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Team() {
  const [team, setTeam] = useState([]);
  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(d => setTeam(Array.isArray(d) ? d : []));
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Meet Our Team</h1>
      <div className={styles.grid}>
        {team.length ? team.map((member, i) => (
          <div key={member.id} className={styles.card} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={styles.avatar}>{member.name.charAt(0)}</div>
            <h3 className={styles.name}>{member.name}</h3>
            <div className={styles.role}>{member.role}</div>
            <p className={styles.bio}>{member.bio}</p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink}>LinkedIn</a>
              <a href="#" className={styles.socialLink}>Twitter</a>
            </div>
          </div>
        )) : <p style={{textAlign: 'center', width: '100%'}}>Loading team members...</p>}
      </div>
    </main>
  );
}
