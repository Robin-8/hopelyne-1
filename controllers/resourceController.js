import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as resourceModel from '@/models/resourceModel';
import { validate, createResourceSchema, updateResourceSchema } from '@/lib/validation';

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
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    const isModerator =
      roles.includes('SUPER_ADMIN') ||
      roles.includes('BLOG_MODERATOR') ||
      roles.includes('FORUM_MODERATOR') ||
      roles.includes('EVENTS_MODERATOR');
    if (!isModerator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { data, error } = validate(createResourceSchema, body);
    if (error) return error;

    const resource = await resourceModel.createResource(data);
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Resources POST error:', error);
    return NextResponse.json({ error: 'Failed to add resource' }, { status: 500 });
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
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    const isModerator =
      roles.includes('SUPER_ADMIN') ||
      roles.includes('BLOG_MODERATOR') ||
      roles.includes('FORUM_MODERATOR') ||
      roles.includes('EVENTS_MODERATOR');
    if (!isModerator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { data, error } = validate(updateResourceSchema, body);
    if (error) return error;

    const resource = await resourceModel.updateResource(id, data);
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Resource PUT error:', error);
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 });
  }
}

export async function deleteResource(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    const isModerator =
      roles.includes('SUPER_ADMIN') ||
      roles.includes('BLOG_MODERATOR') ||
      roles.includes('FORUM_MODERATOR') ||
      roles.includes('EVENTS_MODERATOR');
    if (!isModerator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await resourceModel.deleteResource(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resource DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
}
