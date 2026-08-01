'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) setError('Invalid credentials');
    else router.push('/admin');
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.logo}>H</div>
        <h1 className={styles.title}>hopelyne portal</h1>
        <p className={styles.subtitle}>This portal login is for hopelyne team members only.</p>
        
        <form className={styles.form} onSubmit={handleLogin}>
          <input type="email" placeholder="Email Address" className={styles.input} value={email} onChange={e=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className={styles.input} value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit" className={styles.btnPrimary}>Sign In</button>
        </form>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </main>
  );
}
