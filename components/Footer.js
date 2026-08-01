'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.glow}></div>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img src="/logo.png" alt="HopeLyne" className={styles.logoImg} />
              <span className={styles.logoText}>hopelyne</span>
            </div>
            <p className={styles.tagline}>
              Empowering students to navigate life&apos;s pressures with courage, compassion, and community.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <Link href="/about" className={styles.footerLink}>About Us</Link>
            <Link href="/team" className={styles.footerLink}>Our Team</Link>
            <Link href="/blog" className={styles.footerLink}>Blog</Link>
            <Link href="/events" className={styles.footerLink}>Events</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Community</h4>
            <Link href="/forum" className={styles.footerLink}>Discussion Forum</Link>
            <Link href="/resources" className={styles.footerLink}>Useful Resources</Link>
            <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Support</h4>
            <a href="tel:988" className={styles.footerLink}>📞 Crisis Helpline: 988</a>
            <a href="https://www.crisistextline.org" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>💬 Crisis Text Line</a>
            <a href="https://www.nami.org" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>🧠 NAMI Resources</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} HopeLyne. Built with ❤️ by students, for students.</p>
          <p className={styles.credit}>Founded by Ayisha &amp; friends</p>
        </div>
      </div>
    </footer>
  );
}
