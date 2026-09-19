import prisma from '@/lib/prisma';

const AUTHOR_SELECT = {
  select: { id: true, name: true, avatar: true },
};

export async function getBlogPosts({ where = {}, limit, cursor } = {}) {
  const take = limit ? Math.min(limit, 100) : 20;
  return await prisma.blogPost.findMany({
    where,
    include: { author: AUTHOR_SELECT },
    orderBy: { createdAt: 'desc' },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });
}

export async function getBlogPostByIdOrSlug(identifier) {
  // MongoDB ObjectIds are 24-char hex strings; fallback to slug lookup
  const isObjectId = /^[a-f0-9]{24}$/i.test(identifier);
  return await prisma.blogPost.findFirst({
    where: isObjectId ? { id: identifier } : { slug: identifier },
    include: { author: AUTHOR_SELECT },
  });
}

export async function getBlogPostById(id) {
  return await prisma.blogPost.findUnique({ where: { id } });
}

export async function createBlogPost(data) {
  return await prisma.blogPost.create({ data });
}

export async function updateBlogPost(id, data) {
  return await prisma.blogPost.update({
    where: { id },
    data
  });
}

export async function deleteBlogPost(id) {
  return await prisma.blogPost.delete({ where: { id } });
}
