import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as blogModel from '@/models/blogModel';
import { validate, createBlogSchema, updateBlogSchema } from '@/lib/validation';

export async function getBlogPosts(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tag = searchParams.get('tag');
    const limitParam = searchParams.get('limit');
    const cursor = searchParams.get('cursor') || undefined;
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 100) : 20;

    const where = {};
    if (status) where.status = status;
    if (tag) where.tags = { contains: tag };

    const posts = await blogModel.getBlogPosts({ where, limit, cursor });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function createBlogPost(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('BLOG_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { data, error } = validate(createBlogSchema, body);
    if (error) return error;

    const slug =
      data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
      '-' +
      Math.random().toString(36).slice(2, 8);

    const post = await blogModel.createBlogPost({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      coverImage: data.coverImage || null,
      tags: data.tags,
      status: data.status || 'DRAFT',
      slug,
      authorId: session.user.id,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Blog POST error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

export async function getBlogPostByIdOrSlug(request, { params }) {
  try {
    const { id } = await params;
    const post = await blogModel.getBlogPostByIdOrSlug(id);

    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog GET by id error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function updateBlogPost(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('BLOG_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { data, error } = validate(updateBlogSchema, body);
    if (error) return error;

    const existing = await blogModel.getBlogPostById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updateData = { ...data };
    if (updateData.status === 'PUBLISHED' && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const post = await blogModel.updateBlogPost(id, updateData);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog PUT error:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function deleteBlogPost(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('BLOG_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await blogModel.deleteBlogPost(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
