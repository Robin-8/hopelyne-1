'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import styles from './page.module.css';

export default function Contact() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Message sent successfully!');
    e.target.reset();
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Get in Touch</h1>
      <div className={styles.container}>
        <div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input type="text" placeholder="Your Name" className={styles.input} required />
            <input type="email" placeholder="Your Email" className={styles.input} required />
            <input type="text" placeholder="Subject" className={styles.input} required />
            <textarea placeholder="Your Message" className={styles.textarea} required></textarea>
            <button type="submit" className={styles.btnPrimary}>Send Message</button>
            {status && <p style={{color: 'green'}}>{status}</p>}
          </form>
        </div>
        
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Contact Information</h2>
          <div className={styles.contactInfo}>
            <p>📧 Email: hello@hopelyne.com</p>
            <p>📱 Social: @hopelyne_wellness</p>
            <br/>
            <p style={{color: 'var(--color-primary)'}}><strong>Crisis Resources:</strong></p>
            <p>If you are in immediate danger or experiencing a crisis, please call emergency services or a local hotline immediately.</p>
          </div>

          <div className={styles.faq}>
            <h2 className={styles.panelTitle}>FAQ</h2>
            <div className={styles.faqItem}>
              <div className={styles.faqQ}>Who can join hopelyne?</div>
              <div className={styles.faqA}>Any student looking for support and a safe community can join.</div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQ}>Is the forum anonymous?</div>
              <div className={styles.faqA}>You can choose to post anonymously or with your username.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
