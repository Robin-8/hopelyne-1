import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const topic = await prisma.forumTopic.findUnique({
      where: { id },
      include: {
        author: true,
        replies: {
          include: { 
            author: true,
            likes: true,
            _count: { select: { likes: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(topic);
  } catch (error) {
    console.error('Forum GET by id error:', error);
    return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('FORUM_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await request.json();

    const topic = await prisma.forumTopic.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error('Forum PUT error:', error);
    return NextResponse.json({ error: 'Failed to update topic' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('FORUM_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    // Replies should be deleted via cascade in Prisma schema, but we can do it explicitly if needed.
    // Assuming cascade is set up in schema. If not, delete replies first.
    await prisma.forumReply.deleteMany({ where: { topicId: id } });
    await prisma.forumTopic.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forum DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 });
  }
}
