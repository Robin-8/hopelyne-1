import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    const { id: topicId } = await params;
    const replies = await prisma.forumReply.findMany({
      where: { topicId },
      include: { author: true },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(replies);
  } catch (error) {
    console.error('Forum replies GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: topicId } = await params;
    const { content } = await request.json();

    const reply = await prisma.forumReply.create({
      data: {
        content,
        topicId,
        authorId: session.user.id
      }
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error('Forum replies POST error:', error);
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 });
  }
}
