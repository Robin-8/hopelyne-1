const fs = require('fs');
const path = require('path');

const basePath = '/Users/mahroofnm/.gemini/antigravity/scratch/hopelyne/app';

const files = {
  'page.module.css': `
.main { min-height: 100vh; }
.hero { position: relative; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: linear-gradient(135deg, var(--background), var(--surface)); overflow: hidden; padding: 2rem; }
.hero::before { content: ''; position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, var(--color-primary-light) 0%, transparent 70%); top: -100px; left: -100px; opacity: 0.2; border-radius: 50%; animation: float 10s infinite alternate; }
.hero::after { content: ''; position: absolute; width: 300px; height: 300px; background: radial-gradient(circle, var(--color-accent) 0%, transparent 70%); bottom: -50px; right: -50px; opacity: 0.15; border-radius: 50%; animation: float 8s infinite alternate-reverse; }
@keyframes float { 0% { transform: translateY(0px) translateX(0px); } 100% { transform: translateY(30px) translateX(20px); } }
.title { font-size: clamp(2.5rem, 5vw, 4.5rem); font-family: 'Outfit', sans-serif; font-weight: 800; color: var(--text-primary); margin-bottom: 1.5rem; z-index: 1; max-width: 900px; line-height: 1.1; }
.subtitle { font-size: clamp(1rem, 2vw, 1.25rem); color: var(--text-secondary); max-width: 700px; margin-bottom: 2.5rem; z-index: 1; line-height: 1.6; }
.ctaGroup { display: flex; gap: 1rem; z-index: 1; flex-wrap: wrap; justify-content: center; }
.btnPrimary { padding: 0.8rem 2rem; border-radius: 30px; background: var(--color-primary); color: white; font-weight: 600; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 15px rgba(211, 47, 47, 0.3); }
.btnPrimary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(211, 47, 47, 0.4); }
.btnSecondary { padding: 0.8rem 2rem; border-radius: 30px; background: var(--surface); color: var(--text-primary); border: 1px solid var(--border-color); font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.btnSecondary:hover { transform: translateY(-2px); background: var(--hover-surface); }
.section { padding: 6rem 2rem; max-width: 1200px; margin: 0 auto; }
.sectionTitle { font-size: 2.5rem; text-align: center; margin-bottom: 3rem; color: var(--text-primary); font-family: 'Outfit', sans-serif; }
.statsGrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-top: -3rem; position: relative; z-index: 2; padding: 0 2rem; }
.statCard { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid var(--border-color); border-radius: 20px; padding: 2rem; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.05); transform: translateY(0); transition: transform 0.3s; }
.statCard:hover { transform: translateY(-5px); }
.statNumber { font-size: 3rem; font-weight: 800; color: var(--color-primary); font-family: 'Outfit', sans-serif; margin-bottom: 0.5rem; }
.statLabel { color: var(--text-secondary); font-weight: 500; font-size: 1.1rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
.card { background: var(--surface); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid var(--border-color); transition: transform 0.3s; display: flex; flex-direction: column; }
.card:hover { transform: translateY(-5px); }
.cardImage { width: 100%; height: 200px; background: linear-gradient(45deg, var(--color-secondary), var(--color-accent)); object-fit: cover; }
.cardContent { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
.cardTitle { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary); }
.cardText { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem; flex: 1; }
.reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
.reveal.active { opacity: 1; transform: translateY(0); }
\`,
  'page.js': \`
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const revealRefs = useRef([]);

  useEffect(() => {
    fetch('/api/blog?limit=3&status=PUBLISHED').then(r => r.json()).then(d => setBlogs(d.data || []));
    fetch('/api/events?type=UPCOMING').then(r => r.json()).then(d => setEvents(d.data || []));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.active);
        }
      });
    }, { threshold: 0.1 });

    revealRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const addToRefs = el => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Empowering Students. Building Resilience. Creating Hope.</h1>
        <p className={styles.subtitle}>A student-led awareness and wellness community dedicated to helping you navigate peer pressure, parental expectations, and life's challenges.</p>
        <div className={styles.ctaGroup}>
          <Link href="/contact" className={styles.btnPrimary}>Join the Community</Link>
          <Link href="/resources" className={styles.btnSecondary}>Explore Resources</Link>
        </div>
      </section>

      <section className={styles.statsGrid}>
        {[
          { label: 'Members', num: '50+' },
          { label: 'Blog Posts', num: '5' },
          { label: 'Events', num: '2' },
          { label: 'Resources', num: '10+' }
        ].map((s, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statNumber}>{s.num}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      <section className={\\\`\\\${styles.section} \\\${styles.reveal}\\\`} ref={addToRefs}>
        <h2 className={styles.sectionTitle}>Featured Blogs</h2>
        <div className={styles.grid}>
          {blogs.length ? blogs.map(b => (
            <Link href={'/blog/' + b.slug} key={b.id} className={styles.card}>
              <div className={styles.cardImage}></div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{b.title}</h3>
                <p className={styles.cardText}>{b.excerpt}</p>
              </div>
            </Link>
          )) : <p>Loading blogs...</p>}
        </div>
      </section>
      
      <section className={\\\`\\\${styles.section} \\\${styles.reveal}\\\`} ref={addToRefs}>
        <h2 className={styles.sectionTitle}>Upcoming Events</h2>
        <div className={styles.grid}>
          {events.length ? events.map(e => (
            <div key={e.id} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{e.title}</h3>
                <p className={styles.cardText}>{new Date(e.date).toLocaleDateString()}</p>
              </div>
            </div>
          )) : <p>Loading events...</p>}
        </div>
      </section>
    </main>
  );
}
\`,
  'about/page.module.css': \`
.main { padding: 8rem 2rem 4rem; max-width: 1000px; margin: 0 auto; }
.hero { text-align: center; margin-bottom: 5rem; }
.title { font-size: 3.5rem; font-family: 'Outfit', sans-serif; color: var(--color-primary); margin-bottom: 2rem; }
.vision, .mission { font-size: 1.5rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem; padding: 2rem; background: var(--surface); border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.valuesGrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 4rem; }
.valueCard { padding: 2rem; text-align: center; background: var(--surface); border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border-top: 4px solid var(--color-accent); }
.valueTitle { font-size: 1.25rem; font-weight: bold; color: var(--text-primary); }
.section { margin-bottom: 4rem; }
.sectionTitle { font-size: 2rem; font-family: 'Outfit', sans-serif; margin-bottom: 1.5rem; color: var(--text-primary); }
.text { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem; }
\`,
  'about/page.js': \`
'use client';
import styles from './page.module.css';

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>About HopeLyne</h1>
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
\`,
  'team/page.module.css': \`
.main { padding: 8rem 2rem 4rem; max-width: 1200px; margin: 0 auto; }
.title { font-size: 3rem; font-family: 'Outfit', sans-serif; color: var(--color-primary); text-align: center; margin-bottom: 4rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
.card { background: var(--surface); border-radius: 16px; padding: 2rem; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.05); transition: transform 0.3s; position: relative; overflow: hidden; }
.card:hover { transform: translateY(-10px); }
.avatar { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: white; font-weight: bold; }
.name { font-size: 1.5rem; font-weight: bold; color: var(--text-primary); margin-bottom: 0.5rem; }
.role { color: var(--color-accent); font-weight: 500; margin-bottom: 1rem; }
.bio { color: var(--text-secondary); font-size: 0.95rem; }
.social { position: absolute; bottom: 0; left: 0; right: 0; background: var(--color-primary); padding: 1rem; display: flex; justify-content: center; gap: 1rem; transform: translateY(100%); transition: transform 0.3s; }
.card:hover .social { transform: translateY(0); }
.socialLink { color: white; text-decoration: none; font-size: 0.9rem; }
\`,
  'team/page.js': \`
'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Team() {
  const [team, setTeam] = useState([]);
  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(d => setTeam(d.data || []));
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Meet Our Team</h1>
      <div className={styles.grid}>
        {team.length ? team.map((member, i) => (
          <div key={member.id} className={styles.card} style={{ animationDelay: \\\`\\\${i * 0.1}s\\\` }}>
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
\`,
  'blog/page.module.css': \`
.main { padding: 8rem 2rem 4rem; max-width: 1200px; margin: 0 auto; }
.title { font-size: 3rem; font-family: 'Outfit', sans-serif; color: var(--text-primary); text-align: center; margin-bottom: 3rem; }
.filters { display: flex; justify-content: center; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; }
.filterBtn { padding: 0.5rem 1.5rem; border-radius: 20px; border: 1px solid var(--border-color); background: var(--surface); cursor: pointer; transition: all 0.2s; }
.filterBtn:hover, .filterBtn.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
.card { background: var(--surface); border-radius: 16px; overflow: hidden; text-decoration: none; display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.05); transition: transform 0.3s; }
.card:hover { transform: translateY(-5px); }
.image { height: 200px; background: linear-gradient(45deg, var(--color-secondary), var(--color-accent)); }
.content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
.cardTitle { font-size: 1.25rem; font-weight: bold; color: var(--text-primary); margin-bottom: 0.5rem; }
.excerpt { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem; flex: 1; }
.meta { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); }
\`,
  'blog/page.js': \`
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    fetch('/api/blog?status=PUBLISHED').then(r => r.json()).then(d => setBlogs(d.data || []));
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Our Blog</h1>
      <div className={styles.filters}>
        <button className={\\\`\\\${styles.filterBtn} \\\${styles.active}\\\`}>All</button>
        <button className={styles.filterBtn}>Wellness</button>
        <button className={styles.filterBtn}>Academic</button>
      </div>
      <div className={styles.grid}>
        {blogs.length ? blogs.map(b => (
          <Link href={\\\`/blog/\\\${b.slug}\\\`} key={b.id} className={styles.card}>
            <div className={styles.image}></div>
            <div className={styles.content}>
              <h3 className={styles.cardTitle}>{b.title}</h3>
              <p className={styles.excerpt}>{b.excerpt}</p>
              <div className={styles.meta}>
                <span>{b.author?.name || 'Admin'}</span>
                <span>{new Date(b.publishedAt || b.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        )) : <p style={{textAlign:'center', width:'100%'}}>Loading blogs...</p>}
      </div>
    </main>
  );
}
\`,
  'blog/[slug]/page.module.css': \`
.main { padding: 8rem 2rem 4rem; max-width: 800px; margin: 0 auto; }
.back { display: inline-block; margin-bottom: 2rem; color: var(--color-primary); text-decoration: none; font-weight: 500; }
.image { width: 100%; height: 400px; background: linear-gradient(45deg, var(--color-secondary), var(--color-accent)); border-radius: 16px; margin-bottom: 2rem; }
.title { font-size: 3rem; font-family: 'Outfit', sans-serif; color: var(--text-primary); margin-bottom: 1rem; line-height: 1.2; }
.meta { display: flex; gap: 1rem; color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
.content { font-size: 1.1rem; line-height: 1.8; color: var(--text-primary); white-space: pre-wrap; }
\`,
  'blog/[slug]/page.js': \`
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function BlogDetail({ params }) {
  const [blog, setBlog] = useState(null);
  
  useEffect(() => {
    fetch(\\\`/api/blog/\\\${params.slug}\\\`).then(r => r.json()).then(d => setBlog(d.data));
  }, [params.slug]);

  if (!blog) return <main className={styles.main}><p>Loading...</p></main>;

  return (
    <main className={styles.main}>
      <Link href="/blog" className={styles.back}>← Back to Blog</Link>
      <div className={styles.image}></div>
      <h1 className={styles.title}>{blog.title}</h1>
      <div className={styles.meta}>
        <span>By {blog.author?.name || 'Admin'}</span>
        <span>•</span>
        <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
      </div>
      <div className={styles.content}>{blog.content}</div>
    </main>
  );
}
\`,
  'forum/page.module.css': \`
.main { padding: 8rem 2rem 4rem; max-width: 1000px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem; }
.title { font-size: 2.5rem; font-family: 'Outfit', sans-serif; color: var(--text-primary); }
.btnPrimary { padding: 0.8rem 1.5rem; border-radius: 8px; background: var(--color-primary); color: white; border: none; cursor: pointer; font-weight: 600; text-decoration: none; }
.tabs { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
.tab { background: none; border: none; color: var(--text-secondary); font-size: 1rem; cursor: pointer; padding: 0.5rem 0; position: relative; }
.tab.active { color: var(--color-primary); font-weight: 600; }
.tab.active::after { content: ''; position: absolute; bottom: -1rem; left: 0; width: 100%; height: 2px; background: var(--color-primary); }
.list { display: flex; flex-direction: column; gap: 1rem; }
.card { padding: 1.5rem; background: var(--surface); border-radius: 12px; border: 1px solid var(--border-color); text-decoration: none; display: flex; flex-direction: column; gap: 0.5rem; transition: transform 0.2s; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.card:hover { transform: translateX(5px); border-color: var(--color-primary-light); }
.cardTitle { font-size: 1.25rem; font-weight: bold; color: var(--text-primary); }
.cardMeta { display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-secondary); align-items: center; }
.badge { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
.badgeCategory { background: rgba(255, 143, 0, 0.1); color: var(--color-accent); }
.badgeStatus { background: rgba(211, 47, 47, 0.1); color: var(--color-primary); }
\`,
  'forum/page.js': \`
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

export default function ForumList() {
  const { data: session } = useSession();
  const [topics, setTopics] = useState([]);
  
  useEffect(() => {
    fetch('/api/forum?status=APPROVED').then(r => r.json()).then(d => setTopics(d.data || []));
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Discussion Forum</h1>
        {session ? (
          <button className={styles.btnPrimary}>Start a Discussion</button>
        ) : (
          <Link href="/login" className={styles.btnPrimary}>Login to Post</Link>
        )}
      </div>
      
      <div className={styles.tabs}>
        <button className={\\\`\\\${styles.tab} \\\${styles.active}\\\`}>All Categories</button>
        <button className={styles.tab}>Peer Pressure</button>
        <button className={styles.tab}>Parental Pressure</button>
        <button className={styles.tab}>Wellness</button>
      </div>

      <div className={styles.list}>
        {topics.length ? topics.map(t => (
          <Link href={\\\`/forum/\\\${t.id}\\\`} key={t.id} className={styles.card}>
            <div className={styles.cardTitle}>{t.title}</div>
            <div className={styles.cardMeta}>
              <span className={\\\`\\\${styles.badge} \\\${styles.badgeCategory}\\\`}>{t.category}</span>
              <span>By {t.author?.name || 'Anonymous'}</span>
              <span>•</span>
              <span>{new Date(t.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{t.replies?.length || 0} Replies</span>
            </div>
          </Link>
        )) : <p>Loading topics...</p>}
      </div>
    </main>
  );
}
\`,
  'forum/[id]/page.module.css': \`
.main { padding: 8rem 2rem 4rem; max-width: 800px; margin: 0 auto; }
.back { display: inline-block; margin-bottom: 2rem; color: var(--color-primary); text-decoration: none; font-weight: 500; }
.op { padding: 2rem; background: var(--surface); border-radius: 16px; border: 1px solid var(--border-color); margin-bottom: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.title { font-size: 2rem; font-family: 'Outfit', sans-serif; color: var(--text-primary); margin-bottom: 1rem; }
.meta { display: flex; gap: 1rem; color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
.content { font-size: 1.05rem; line-height: 1.6; color: var(--text-primary); white-space: pre-wrap; }
.repliesHeader { font-size: 1.5rem; margin-bottom: 1.5rem; font-family: 'Outfit', sans-serif; }
.reply { padding: 1.5rem; background: var(--surface); border-radius: 12px; margin-bottom: 1rem; border: 1px solid var(--border-color); }
.replyMeta { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: bold; }
.replyContent { color: var(--text-primary); white-space: pre-wrap; line-height: 1.5; }
.replyForm { margin-top: 3rem; display: flex; flex-direction: column; gap: 1rem; }
.textarea { width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--surface); color: var(--text-primary); min-height: 120px; font-family: inherit; resize: vertical; }
.btnPrimary { align-self: flex-start; padding: 0.8rem 1.5rem; border-radius: 8px; background: var(--color-primary); color: white; border: none; cursor: pointer; font-weight: 600; }
\`,
  'forum/[id]/page.js': \`
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

export default function ForumThread({ params }) {
  const { data: session } = useSession();
  const [topic, setTopic] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetch(\\\`/api/forum/\\\${params.id}\\\`).then(r => r.json()).then(d => setTopic(d.data));
  }, [params.id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent) return;
    const res = await fetch(\\\`/api/forum/\\\${params.id}/replies\\\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: replyContent })
    });
    if (res.ok) {
      setReplyContent('');
      // fetch again to update
      fetch(\\\`/api/forum/\\\${params.id}\\\`).then(r => r.json()).then(d => setTopic(d.data));
    }
  };

  if (!topic) return <main className={styles.main}><p>Loading...</p></main>;

  return (
    <main className={styles.main}>
      <Link href="/forum" className={styles.back}>← Back to Forum</Link>
      <div className={styles.op}>
        <h1 className={styles.title}>{topic.title}</h1>
        <div className={styles.meta}>
          <span>By {topic.author?.name || 'Anonymous'}</span>
          <span>•</span>
          <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{topic.category}</span>
        </div>
        <div className={styles.content}>{topic.content}</div>
      </div>

      <h3 className={styles.repliesHeader}>{topic.replies?.length || 0} Replies</h3>
      {topic.replies?.map(r => (
        <div key={r.id} className={styles.reply}>
          <div className={styles.replyMeta}>{r.author?.name || 'Anonymous'} • {new Date(r.createdAt).toLocaleDateString()}</div>
          <div className={styles.replyContent}>{r.content}</div>
        </div>
      ))}

      {session ? (
        <form className={styles.replyForm} onSubmit={handleReply}>
          <textarea className={styles.textarea} placeholder="Write a reply..." value={replyContent} onChange={e => setReplyContent(e.target.value)} required />
          <button type="submit" className={styles.btnPrimary}>Post Reply</button>
        </form>
      ) : (
        <p style={{marginTop: '2rem'}}>Please <Link href="/login" style={{color: 'var(--color-primary)'}}>login</Link> to reply.</p>
      )}
    </main>
  );
}
\`,
  'events/page.module.css': \`
.main { padding: 8rem 2rem 4rem; max-width: 1200px; margin: 0 auto; }
.title { font-size: 3rem; font-family: 'Outfit', sans-serif; color: var(--text-primary); text-align: center; margin-bottom: 2rem; }
.tabs { display: flex; justify-content: center; gap: 2rem; margin-bottom: 3rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
.tab { background: none; border: none; font-size: 1.25rem; font-weight: 500; color: var(--text-secondary); cursor: pointer; position: relative; }
.tab.active { color: var(--color-primary); font-weight: bold; }
.tab.active::after { content: ''; position: absolute; bottom: -1rem; left: 0; width: 100%; height: 3px; background: var(--color-primary); border-radius: 3px 3px 0 0; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
.card { background: var(--surface); border-radius: 16px; border: 1px solid var(--border-color); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); transition: transform 0.3s; display: flex; flex-direction: column; }
.card:hover { transform: translateY(-5px); }
.cardImage { height: 180px; background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); position: relative; }
.dateBadge { position: absolute; top: 1rem; right: 1rem; background: white; color: var(--color-primary); padding: 0.5rem; border-radius: 8px; text-align: center; font-weight: bold; min-width: 60px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.dateBadge .month { font-size: 0.8rem; text-transform: uppercase; }
.dateBadge .day { font-size: 1.5rem; line-height: 1; }
.cardContent { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
.cardTitle { font-size: 1.25rem; font-weight: bold; color: var(--text-primary); margin-bottom: 0.5rem; }
.venue { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
.desc { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem; flex: 1; }
.btnPrimary { padding: 0.8rem; text-align: center; border-radius: 8px; background: var(--color-primary); color: white; font-weight: 600; text-decoration: none; display: block; border: none; cursor: pointer; }
\`,
  'events/page.js': \`
'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState('UPCOMING');

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(d => setEvents(d.data || []));
  }, []);

  const filtered = events.filter(e => {
    const isPast = new Date(e.date) < new Date();
    return tab === 'UPCOMING' ? !isPast : isPast;
  });

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Events</h1>
      <div className={styles.tabs}>
        <button className={\\\`\\\${styles.tab} \\\${tab === 'UPCOMING' ? styles.active : ''}\\\`} onClick={() => setTab('UPCOMING')}>Upcoming</button>
        <button className={\\\`\\\${styles.tab} \\\${tab === 'PAST' ? styles.active : ''}\\\`} onClick={() => setTab('PAST')}>Past Events</button>
      </div>

      <div className={styles.grid}>
        {filtered.length ? filtered.map(e => {
          const d = new Date(e.date);
          return (
            <div key={e.id} className={styles.card}>
              <div className={styles.cardImage}>
                <div className={styles.dateBadge}>
                  <div className={styles.month}>{d.toLocaleString('default', { month: 'short' })}</div>
                  <div className={styles.day}>{d.getDate()}</div>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{e.title}</h3>
                <div className={styles.venue}>📍 {e.venue || 'TBA'}</div>
                <p className={styles.desc}>{e.description}</p>
                {tab === 'UPCOMING' && <button className={styles.btnPrimary}>RSVP Now</button>}
              </div>
            </div>
          );
        }) : <p style={{textAlign: 'center', width: '100%', gridColumn: '1/-1'}}>No events found.</p>}
      </div>
    </main>
  );
}
\`,
  'resources/page.module.css': \`
.main { padding: 8rem 2rem 4rem; max-width: 1200px; margin: 0 auto; }
.title { font-size: 3rem; font-family: 'Outfit', sans-serif; color: var(--text-primary); text-align: center; margin-bottom: 2rem; }
.filters { display: flex; justify-content: center; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; }
.filterBtn { padding: 0.5rem 1.5rem; border-radius: 20px; border: 1px solid var(--border-color); background: var(--surface); cursor: pointer; transition: all 0.2s; }
.filterBtn:hover, .filterBtn.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
.card { background: var(--surface); border-radius: 16px; border: 1px solid var(--border-color); padding: 1.5rem; display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.05); transition: transform 0.3s; }
.card:hover { transform: translateY(-5px); }
.badge { align-self: flex-start; padding: 0.3rem 0.8rem; border-radius: 12px; font-size: 0.75rem; font-weight: bold; background: rgba(255, 143, 0, 0.1); color: var(--color-accent); margin-bottom: 1rem; }
.cardTitle { font-size: 1.25rem; font-weight: bold; color: var(--text-primary); margin-bottom: 0.5rem; }
.desc { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem; flex: 1; }
.link { color: var(--color-primary); font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; }
.link:hover { text-decoration: underline; }
\`,
  'resources/page.js': \`
'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Resources() {
  const [resources, setResources] = useState([]);
  
  useEffect(() => {
    fetch('/api/resources').then(r => r.json()).then(d => setResources(d.data || []));
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Useful Articles & Links</h1>
      <div className={styles.filters}>
        <button className={\\\`\\\${styles.filterBtn} \\\${styles.active}\\\`}>All</button>
        <button className={styles.filterBtn}>Books</button>
        <button className={styles.filterBtn}>Articles</button>
        <button className={styles.filterBtn}>YouTube</button>
      </div>

      <div className={styles.grid}>
        {resources.length ? resources.map(r => (
          <div key={r.id} className={styles.card}>
            <div className={styles.badge}>{r.type}</div>
            <h3 className={styles.cardTitle}>{r.title}</h3>
            <p className={styles.desc}>{r.description}</p>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {r.type === 'YOUTUBE' ? 'Watch Video ↗' : 'Read More ↗'}
            </a>
          </div>
        )) : <p style={{textAlign: 'center', width: '100%', gridColumn: '1/-1'}}>Loading resources...</p>}
      </div>
    </main>
  );
}
\`,
  'contact/page.module.css': \`
.main { padding: 8rem 2rem 4rem; max-width: 1000px; margin: 0 auto; }
.title { font-size: 3rem; font-family: 'Outfit', sans-serif; color: var(--text-primary); text-align: center; margin-bottom: 3rem; }
.container { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
@media (max-width: 768px) { .container { grid-template-columns: 1fr; } }
.form { display: flex; flex-direction: column; gap: 1.5rem; }
.input, .textarea { width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--surface); color: var(--text-primary); font-family: inherit; }
.textarea { min-height: 150px; resize: vertical; }
.btnPrimary { padding: 1rem; border-radius: 8px; background: var(--color-primary); color: white; border: none; cursor: pointer; font-weight: 600; font-size: 1rem; transition: background 0.2s; }
.btnPrimary:hover { background: var(--color-primary-dark); }
.panel { background: var(--surface); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); }
.panelTitle { font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem; color: var(--text-primary); }
.contactInfo { margin-bottom: 2rem; color: var(--text-secondary); line-height: 1.8; }
.faq { margin-top: 2rem; }
.faqItem { margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
.faqQ { font-weight: bold; color: var(--text-primary); margin-bottom: 0.5rem; }
.faqA { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; }
\`,
  'contact/page.js': \`
'use client';
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
              <div className={styles.faqQ}>Who can join HopeLyne?</div>
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
\`,
  'login/page.module.css': \`
.main { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; background: linear-gradient(135deg, var(--background), var(--surface)); }
.card { background: var(--surface); padding: 3rem; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); width: 100%; max-width: 400px; border: 1px solid var(--border-color); text-align: center; }
.logo { width: 64px; height: 64px; margin: 0 auto 1.5rem; background: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; }
.title { font-size: 2rem; font-family: 'Outfit', sans-serif; color: var(--text-primary); margin-bottom: 0.5rem; }
.subtitle { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 2rem; }
.form { display: flex; flex-direction: column; gap: 1rem; }
.input { width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--background); color: var(--text-primary); }
.btnPrimary { width: 100%; padding: 1rem; border-radius: 8px; background: var(--color-primary); color: white; border: none; cursor: pointer; font-weight: 600; margin-top: 1rem; }
.error { color: var(--color-primary); font-size: 0.9rem; margin-top: 1rem; }
\`,
  'login/page.js': \`
'use client';
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
        <h1 className={styles.title}>HopeLyne Portal</h1>
        <p className={styles.subtitle}>This portal login is for HopeLyne team members only.</p>
        
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
\`
};

Object.entries(files).forEach(([relPath, content]) => {
  const fullPath = path.join(basePath, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
});

console.log('Pages generated successfully.');
