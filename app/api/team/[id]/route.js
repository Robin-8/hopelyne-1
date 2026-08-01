import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const member = await prisma.teamMember.findUnique({ where: { id } });
    
    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(member);
  } catch (error) {
    console.error('Team Member GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.photoUrl !== undefined) updateData.photoUrl = body.photoUrl;
    if (body.linkedIn !== undefined || body.linkedinUrl !== undefined) updateData.linkedIn = body.linkedIn || body.linkedinUrl;
    if (body.twitter !== undefined || body.twitterUrl !== undefined) updateData.twitter = body.twitter || body.twitterUrl;
    if (body.instagram !== undefined || body.instagramUrl !== undefined) updateData.instagram = body.instagram || body.instagramUrl;
    if (body.displayOrder !== undefined || body.order !== undefined) updateData.displayOrder = body.displayOrder ?? body.order;

    const member = await prisma.teamMember.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Team Member PUT error:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.teamMember.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Team Member DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
