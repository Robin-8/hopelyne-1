'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === 'loading') return <div className="p-4">Loading...</div>;
  if (status === 'unauthenticated' || !session?.user?.roles?.length) {
    return <div className="p-4 text-center">Access Denied</div>;
  }

  const isSuperAdmin = session.user.roles.includes('SUPER_ADMIN');

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>hopelyne Admin</div>
        <nav className={styles.nav}>
          <Link href="/admin" className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}>Dashboard</Link>
          <Link href="/admin/blog" className={`${styles.navLink} ${pathname.startsWith('/admin/blog') ? styles.active : ''}`}>Blog</Link>
          <Link href="/admin/forum" className={`${styles.navLink} ${pathname.startsWith('/admin/forum') ? styles.active : ''}`}>Forum</Link>
          <Link href="/admin/events" className={`${styles.navLink} ${pathname.startsWith('/admin/events') ? styles.active : ''}`}>Events</Link>
          <Link href="/admin/team" className={`${styles.navLink} ${pathname.startsWith('/admin/team') ? styles.active : ''}`}>Team</Link>
          <Link href="/admin/resources" className={`${styles.navLink} ${pathname.startsWith('/admin/resources') ? styles.active : ''}`}>Resources</Link>
          {isSuperAdmin && (
            <Link href="/admin/users" className={`${styles.navLink} ${pathname.startsWith('/admin/users') ? styles.active : ''}`}>Users</Link>
          )}
          <Link href="/" className={styles.navLink} style={{ marginTop: '1rem', border: '1px solid var(--border)' }}>Back to Site</Link>
        </nav>
        <div className={styles.user}>
          Logged in as: {session.user.name || session.user.email}
        </div>
      </aside>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}