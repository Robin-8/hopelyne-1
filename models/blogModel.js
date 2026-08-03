import prisma from '@/lib/prisma';

export async function getBlogPosts({ where = {}, limit } = {}) {
  return await prisma.blogPost.findMany({
    where,
    include: { author: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getBlogPostByIdOrSlug(identifier) {
  const isCuid = /^c[a-z0-9]{24}$/i.test(identifier) || identifier.length === 25;
  return await prisma.blogPost.findFirst({
    where: isCuid ? { id: identifier } : { slug: identifier },
    include: { author: true }
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
