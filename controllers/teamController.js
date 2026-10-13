import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as teamModel from '@/models/teamModel';
import { validate, createTeamMemberSchema, updateTeamMemberSchema } from '@/lib/validation';

export async function getTeamMembers() {
  try {
    const teamMembers = await teamModel.getTeamMembers();
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Team GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

function extractRoles(userRoles) {
  if (Array.isArray(userRoles)) return userRoles;
  if (typeof userRoles === 'string') return userRoles.split(',').map(r => r.trim()).filter(Boolean);
  return [];
}

function checkSuperAdminPermission(session) {
  if (!session) return { error: 'Unauthorized', status: 401 };
  const roles = extractRoles(session.user?.roles);
  if (!roles.includes('SUPER_ADMIN')) {
    return { error: 'Forbidden', status: 403 };
  }
  return null;
}

export async function createTeamMember(request) {
  try {
    const session = await getServerSession(authOptions);
    const authError = checkSuperAdminPermission(session);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const body = await request.json();
    // Normalize field aliases before validation
    const normalized = {
      ...body,
      linkedIn: body.linkedIn ?? body.linkedinUrl,
      twitter: body.twitter ?? body.twitterUrl,
      instagram: body.instagram ?? body.instagramUrl,
      displayOrder: body.displayOrder ?? body.order ?? 0,
    };
    const { data, error } = validate(createTeamMemberSchema, normalized);
    if (error) return error;

    const member = await teamModel.createTeamMember(data);
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Team POST error:', error);
    return NextResponse.json({ error: 'Failed to add team member', details: [error.message] }, { status: 500 });
  }
}

export async function getTeamMemberById(request, { params }) {
  try {
    const { id } = await params;
    const member = await teamModel.getTeamMemberById(id);

    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(member);
  } catch (error) {
    console.error('Team Member GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
  }
}

export async function updateTeamMember(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const authError = checkSuperAdminPermission(session);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { id } = await params;
    const body = await request.json();
    const normalized = {
      ...body,
      linkedIn: body.linkedIn ?? body.linkedinUrl,
      twitter: body.twitter ?? body.twitterUrl,
      instagram: body.instagram ?? body.instagramUrl,
      displayOrder: body.displayOrder ?? body.order,
    };
    const { data, error } = validate(updateTeamMemberSchema, normalized);
    if (error) return error;

    const member = await teamModel.updateTeamMember(id, data);
    return NextResponse.json(member);
  } catch (error) {
    console.error('Team Member PUT error:', error);
    return NextResponse.json({ error: 'Failed to update team member', details: [error.message] }, { status: 500 });
  }
}

export async function deleteTeamMember(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const authError = checkSuperAdminPermission(session);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { id } = await params;
    await teamModel.deleteTeamMember(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Team Member DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete team member', details: [error.message] }, { status: 500 });
  }
}
