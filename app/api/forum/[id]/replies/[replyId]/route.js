import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('FORUM_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { replyId } = await params;
    await prisma.forumReply.delete({ where: { id: replyId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forum reply DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete reply' }, { status: 500 });
  }
}
