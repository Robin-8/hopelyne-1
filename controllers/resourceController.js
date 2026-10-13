import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as resourceModel from '@/models/resourceModel';
import { validate, createResourceSchema, updateResourceSchema } from '@/lib/validation';

function extractRoles(userRoles) {
  if (Array.isArray(userRoles)) return userRoles;
  if (typeof userRoles === 'string') return userRoles.split(',').map(r => r.trim()).filter(Boolean);
  return [];
}

function checkModeratorPermission(session) {
  if (!session) return { error: 'Unauthorized', status: 401 };
  const roles = extractRoles(session.user?.roles);
  const isModerator =
    roles.includes('SUPER_ADMIN') ||
    roles.includes('BLOG_MODERATOR') ||
    roles.includes('FORUM_MODERATOR') ||
    roles.includes('EVENTS_MODERATOR');
  if (!isModerator) return { error: 'Forbidden', status: 403 };
  return null;
}

export async function getResources(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where = type ? { type } : {};
    const resources = await resourceModel.getResources(where);

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Resources GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function createResource(request) {
  try {
    const session = await getServerSession(authOptions);
    const authError = checkModeratorPermission(session);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const body = await request.json();
    const { data, error } = validate(createResourceSchema, body);
    if (error) return error;

    const resource = await resourceModel.createResource(data);
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Resources POST error:', error);
    return NextResponse.json({ error: 'Failed to add resource', details: [error.message] }, { status: 500 });
  }
}

export async function getResourceById(request, { params }) {
  try {
    const { id } = await params;
    const resource = await resourceModel.getResourceById(id);

    if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Resource GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 });
  }
}

export async function updateResource(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const authError = checkModeratorPermission(session);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { id } = await params;
    const body = await request.json();
    const { data, error } = validate(updateResourceSchema, body);
    if (error) return error;

    const resource = await resourceModel.updateResource(id, data);
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Resource PUT error:', error);
    return NextResponse.json({ error: 'Failed to update resource', details: [error.message] }, { status: 500 });
  }
}

export async function deleteResource(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const authError = checkModeratorPermission(session);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { id } = await params;
    await resourceModel.deleteResource(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resource DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete resource', details: [error.message] }, { status: 500 });
  }
}
