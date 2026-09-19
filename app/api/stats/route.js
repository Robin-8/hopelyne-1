import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    const hasAny =
      roles.includes('SUPER_ADMIN') ||
      roles.includes('BLOG_MODERATOR') ||
      roles.includes('FORUM_MODERATOR') ||
      roles.includes('EVENTS_MODERATOR');
    if (!hasAny) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Run all counts in parallel — one aggregate query each, no document data transfer
    const [blogs, pendingTopics, upcomingEvents, teamMembers, resources] = await Promise.all([
      prisma.blogPost.count(),
      prisma.forumTopic.count({ where: { status: 'PENDING' } }),
      prisma.event.count({ where: { type: 'UPCOMING' } }),
      prisma.teamMember.count(),
      prisma.usefulResource.count(),
    ]);

    return NextResponse.json({
      blogs,
      forumTopics: pendingTopics,
      events: upcomingEvents,
      teamMembers,
      resources,
    });
  } catch (error) {
    console.error('Stats GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
