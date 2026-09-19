// Server Component — fetches data at request time, no client-side useEffect needed
import { getTeamMembers } from '@/models/teamModel';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Team() {
  // Direct model access from the server — no internal HTTP round-trip
  const team = await getTeamMembers();

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
              {member.linkedIn && <a href={member.linkedIn} className={styles.socialLink} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              {member.twitter && <a href={member.twitter} className={styles.socialLink} target="_blank" rel="noopener noreferrer">Twitter</a>}
            </div>
          </div>
        )) : <p style={{textAlign: 'center', width: '100%'}}>No team members found.</p>}
      </div>
    </main>
  );
}
