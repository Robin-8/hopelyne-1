'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { hasAnyRole, ROLES } from '@/lib/constants';
import styles from './NavBar.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
  { href: '/blog', label: 'Blog' },
  { href: '/forum', label: 'Forum' },
  { href: '/events', label: 'Events' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
];

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isAdmin = session?.user && hasAnyRole(session.user, [
    ROLES.SUPER_ADMIN, ROLES.BLOG_MODERATOR, ROLES.FORUM_MODERATOR, ROLES.EVENTS_MODERATOR
  ]);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.png" alt="HopeLyne" className={styles.logoImg} />
          <span className={styles.logoText}>hopelyne</span>
        </Link>

        <div className={`${styles.links} ${mobileOpen ? styles.open : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              className={`${styles.link} ${styles.adminLink} ${pathname.startsWith('/admin') ? styles.active : ''}`}
            >
              ⚙️ Admin
            </Link>
          )}

          <div className={styles.actions}>
            <button
              onClick={toggleTheme}
              className={styles.themeBtn}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {session ? (
              <div className={styles.userMenu}>
                <span className={styles.userName}>{session.user.name}</span>
                <button onClick={() => signOut()} className={`btn btn-sm btn-outline ${styles.authBtn}`}>
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className={`btn btn-sm btn-primary ${styles.authBtn}`}>
                Login
              </Link>
            )}
          </div>
        </div>

        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
