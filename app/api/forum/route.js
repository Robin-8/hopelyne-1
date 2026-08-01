import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const where = {};
    if (!showAll && status) where.status = status;
    else if (!showAll && !status) where.status = 'APPROVED';
    if (category) where.category = category;

    const topics = await prisma.forumTopic.findMany({
      where,
      include: {
        author: true,
        _count: { select: { replies: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error('Forum GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, content, category } = body;

    const topic = await prisma.forumTopic.create({
      data: {
        title,
        content,
        category,
        status: 'PENDING',
        authorId: session.user.id
      }
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error('Forum POST error:', error);
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 });
  }
}
