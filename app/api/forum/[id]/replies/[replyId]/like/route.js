import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: topicId, replyId } = await params;
    const userId = session.user.id;

    // Check if like exists
    const existingLike = await prisma.replyLike.findUnique({
      where: {
        replyId_userId: {
          replyId: replyId,
          userId: userId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.replyLike.delete({
        where: {
          replyId_userId: {
            replyId: replyId,
            userId: userId,
          },
        },
      });
    } else {
      // Like
      await prisma.replyLike.create({
        data: {
          replyId: replyId,
          userId: userId,
        },
      });
    }

    // Get new count
    const likeCount = await prisma.replyLike.count({
      where: { replyId: replyId },
    });

    return NextResponse.json({
      liked: !existingLike,
      likeCount: likeCount,
    });
  } catch (error) {
    console.error('Like reply error:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
