import { getBlogPostByIdOrSlug, updateBlogPost, deleteBlogPost } from '@/controllers/blogController';

export async function GET(request, context) {
  return await getBlogPostByIdOrSlug(request, context);
}

export async function PUT(request, context) {
  return await updateBlogPost(request, context);
}

export async function DELETE(request, context) {
  return await deleteBlogPost(request, context);
}
