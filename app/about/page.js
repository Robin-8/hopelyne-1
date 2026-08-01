'use client';
export const dynamic = 'force-dynamic';
import styles from './page.module.css';

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>About hopelyne</h1>
        <div className={styles.vision}><strong>Vision:</strong> A world where every student has the support and tools to thrive, free from the burden of unmanaged pressure.</div>
        <div className={styles.mission}><strong>Mission:</strong> To create a safe, inclusive community where students can share, learn, and grow — breaking the stigma around mental health and building resilience together.</div>
      </div>
      
      <div className={styles.valuesGrid}>
        {['Compassion', 'Courage', 'Community', 'Growth'].map(v => (
          <div key={v} className={styles.valueCard}><div className={styles.valueTitle}>{v}</div></div>
        ))}
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why We Exist</h2>
        <p className={styles.text}>Students today face unprecedented levels of peer pressure, parental expectations, academic stress, and isolation. HopeLyne was created to bridge the gap and provide a supportive platform where no one has to face these challenges alone.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Story</h2>
        <p className={styles.text}>Founded by Ayisha, HopeLyne started as a simple idea to connect students going through similar struggles. It has since grown into a thriving community dedicated to wellness and support.</p>
      </section>
    </main>
  );
}
