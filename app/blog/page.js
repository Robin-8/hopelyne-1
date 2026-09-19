// Server Component — fetches published blog posts at request time
import { getBlogPosts } from '@/models/blogModel';
import BlogListClient from './BlogListClient';

export const dynamic = 'force-dynamic';

export default async function BlogList() {
  // Direct model access — no internal HTTP round-trip
  const blogs = await getBlogPosts({ where: { status: 'PUBLISHED' }, limit: 50 });

  // Extract unique tags on the server
  const allTags = new Set();
  blogs.forEach(post => {
    if (post.tags) post.tags.split(',').forEach(tag => allTags.add(tag.trim()));
  });
  const tags = Array.from(allTags).filter(Boolean);

  return <BlogListClient blogs={blogs} tags={tags} />;
}
