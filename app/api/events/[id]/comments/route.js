import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    const { id: eventId } = await params;
    const comments = await prisma.eventComment.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Comments GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;
    const userId = session.user.id;
    const { content, rating, userName } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const comment = await prisma.eventComment.create({
      data: {
        eventId,
        userId,
        userName: userName || session.user.name || 'Anonymous',
        content,
        rating: rating ? parseInt(rating) : null
      }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Comments POST error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
