import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const resource = await prisma.usefulResource.findUnique({ where: { id } });
    
    if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Resource GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const roles = session.user.roles || [];
    const isModerator = roles.includes('SUPER_ADMIN') || roles.includes('BLOG_MODERATOR') || roles.includes('FORUM_MODERATOR') || roles.includes('EVENTS_MODERATOR');
    if (!isModerator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const resource = await prisma.usefulResource.update({
      where: { id },
      data: body
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Resource PUT error:', error);
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const roles = session.user.roles || [];
    const isModerator = roles.includes('SUPER_ADMIN') || roles.includes('BLOG_MODERATOR') || roles.includes('FORUM_MODERATOR') || roles.includes('EVENTS_MODERATOR');
    if (!isModerator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.usefulResource.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resource DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
}
