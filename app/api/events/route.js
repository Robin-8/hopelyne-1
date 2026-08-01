import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where = {};
    let orderBy = { date: 'asc' };

    if (type) {
      where.type = type;
      if (type === 'PAST') {
        orderBy = { date: 'desc' };
      }
    }

    const events = await prisma.event.findMany({
      where,
      orderBy
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Events GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('EVENTS_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const event = await prisma.event.create({
      data: body
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Events POST error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
