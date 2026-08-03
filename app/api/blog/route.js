import { getBlogPosts, createBlogPost } from '@/controllers/blogController';

export async function GET(request) {
  return await getBlogPosts(request);
}

export async function POST(request) {
  return await createBlogPost(request);
}
