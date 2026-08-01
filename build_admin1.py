import os

base_dir = "/Users/mahroofnm/.gemini/antigravity/scratch/hopelyne"

files = {
    "app/admin/layout.module.css": """
.layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--background);
}
.sidebar {
  width: 250px;
  background-color: var(--surface);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary);
  margin-bottom: 2rem;
  text-align: center;
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
}
.navLink {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
}
.navLink:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}
.active {
  background-color: var(--primary);
  color: white;
}
.active:hover {
  background-color: var(--primary-dark);
}
.content {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
}
.user {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  color: var(--text-secondary);
}
@media (max-width: 768px) {
  .layout { flex-direction: column; }
  .sidebar { width: 100%; border-right: none; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
  .nav { flex-direction: row; flex-wrap: wrap; }
}
""",
    "app/admin/layout.js": """
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
        <div className={styles.logo}>HopeLyne Admin</div>
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
""",
    "app/admin/page.module.css": """
.dashboard { display: flex; flex-direction: column; gap: 2rem; }
.welcome { font-size: 2rem; color: var(--text-primary); margin-bottom: 1rem; }
.statsGrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.statCard { background: var(--surface); padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; border-bottom: 4px solid var(--primary); }
.statValue { font-size: 2.5rem; font-weight: bold; color: var(--primary); }
.statLabel { color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem; }
.feedGrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
.feedCard { background: var(--surface); border-radius: 12px; padding: 1.5rem; }
.feedTitle { font-size: 1.25rem; margin-bottom: 1rem; color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
.feedItem { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.actions { display: flex; gap: 1rem; margin-top: 1rem; }
""",
    "app/admin/page.js": """
'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ blog: 0, forum: 0, events: 0, team: 0, resources: 0 });
  const [feed, setFeed] = useState({ blogs: [], forum: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch these from /api/stats
    // Simulating API call for now since APIs are built in parallel
    setTimeout(() => {
      setStats({ blog: 12, forum: 5, events: 3, team: 8, resources: 20 });
      setFeed({
        blogs: [{ id: 1, title: 'Welcome to HopeLyne', date: '2023-10-01' }],
        forum: [{ id: 1, title: 'Anxiety Help', date: '2023-10-02' }]
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.welcome}>Welcome back, {session?.user?.name || 'Admin'}</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}><div className={styles.statValue}>{stats.blog}</div><div className={styles.statLabel}>Total Blog Posts</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{stats.forum}</div><div className={styles.statLabel}>Pending Topics</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{stats.events}</div><div className={styles.statLabel}>Upcoming Events</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{stats.team}</div><div className={styles.statLabel}>Team Members</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{stats.resources}</div><div className={styles.statLabel}>Total Resources</div></div>
      </div>

      <div className={styles.actions}>
        <Link href="/admin/blog/new" className="btn btn-primary">New Blog Post</Link>
        <Link href="/admin/events/new" className="btn btn-secondary">New Event</Link>
        <Link href="/admin/forum" className="btn btn-accent">View Pending Topics</Link>
      </div>
    </div>
  );
}
"""
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content.strip() + "\\n")
print("Basic admin dashboard written.")
