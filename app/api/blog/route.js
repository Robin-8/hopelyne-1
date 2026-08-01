import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit'), 10) : undefined;
    const tag = searchParams.get('tag');

    const where = {};
    if (status) where.status = status;
    if (tag) where.tags = { contains: tag };

    const posts = await prisma.blogPost.findMany({
      where,
      include: { author: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('BLOG_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, tags, status } = body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).slice(2, 8);

    const post = await prisma.blogPost.create({
      data: {
        title, content, excerpt, coverImage, tags, status: status || 'DRAFT', slug, authorId: session.user.id
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Blog POST error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
