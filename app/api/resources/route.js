import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where = type ? { type } : {};
    
    const resources = await prisma.usefulResource.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Resources GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const roles = session.user.roles || [];
    const isModerator = roles.includes('SUPER_ADMIN') || roles.includes('BLOG_MODERATOR') || roles.includes('FORUM_MODERATOR') || roles.includes('EVENTS_MODERATOR');
    if (!isModerator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const resource = await prisma.usefulResource.create({
      data: body
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Resources POST error:', error);
    return NextResponse.json({ error: 'Failed to add resource' }, { status: 500 });
  }
}
