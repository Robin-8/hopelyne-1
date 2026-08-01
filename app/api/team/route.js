import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Team GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const member = await prisma.teamMember.create({
      data: {
        name: body.name,
        role: body.role,
        bio: body.bio || null,
        photoUrl: body.photoUrl || null,
        linkedIn: body.linkedIn || body.linkedinUrl || null,
        twitter: body.twitter || body.twitterUrl || null,
        instagram: body.instagram || body.instagramUrl || null,
        displayOrder: body.displayOrder ?? body.order ?? 0,
      }
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Team POST error:', error);
    return NextResponse.json({ error: 'Failed to add team member' }, { status: 500 });
  }
}
