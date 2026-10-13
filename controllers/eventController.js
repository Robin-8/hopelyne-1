import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as eventModel from '@/models/eventModel';
import prisma from '@/lib/prisma';
import {
  validate,
  createEventSchema,
  updateEventSchema,
  createEventCommentSchema,
} from '@/lib/validation';

export async function getEvents(request) {
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

    const events = await eventModel.getEvents({ where, orderBy });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Events GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

function extractRoles(userRoles) {
  if (Array.isArray(userRoles)) return userRoles;
  if (typeof userRoles === 'string') return userRoles.split(',').map(r => r.trim()).filter(Boolean);
  return [];
}

function checkEventModeratorPermission(session) {
  if (!session) return { error: 'Unauthorized', status: 401 };
  const roles = extractRoles(session.user?.roles);
  if (!roles.includes('SUPER_ADMIN') && !roles.includes('EVENTS_MODERATOR')) {
    return { error: 'Forbidden', status: 403 };
  }
  return null;
}

export async function createEvent(request) {
  try {
    const session = await getServerSession(authOptions);
    const authError = checkEventModeratorPermission(session);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const body = await request.json();
    const { data, error } = validate(createEventSchema, body);
    if (error) return error;

    const event = await eventModel.createEvent(data);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Events POST error:', error);
    return NextResponse.json({ error: 'Failed to create event', details: [error.message] }, { status: 500 });
  }
}

export async function getEventById(request, { params }) {
  try {
    const { id } = await params;
    const event = await eventModel.getEventById(id);

    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    console.error('Event GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function updateEvent(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const authError = checkEventModeratorPermission(session);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { id } = await params;
    const body = await request.json();
    const { data, error } = validate(updateEventSchema, body);
    if (error) return error;

    const event = await eventModel.updateEvent(id, data);
    return NextResponse.json(event);
  } catch (error) {
    console.error('Event PUT error:', error);
    return NextResponse.json({ error: 'Failed to update event', details: [error.message] }, { status: 500 });
  }
}

export async function deleteEvent(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const authError = checkEventModeratorPermission(session);
    if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

    const { id } = await params;
    await eventModel.deleteEvent(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete event', details: [error.message] }, { status: 500 });
  }
}

export async function getEventComments(request, { params }) {
  try {
    const { id: eventId } = await params;
    const comments = await eventModel.getEventComments(eventId);

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Comments GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function createEventComment(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;
    const userId = session.user.id;

    const body = await request.json();
    const { data, error } = validate(createEventCommentSchema, body);
    if (error) return error;

    const comment = await eventModel.createEventComment({
      eventId,
      userId,
      userName: data.userName || session.user.name || 'Anonymous',
      content: data.content,
      rating: data.rating ?? null,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Comments POST error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}

export async function toggleEventAttendance(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;
    const userId = session.user.id;

    // Minimal existence check — only fetch id to avoid loading attendances/comments
    const exists = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });
    if (!exists) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const result = await eventModel.toggleEventAttendance(eventId, userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Attendance POST error:', error);
    return NextResponse.json({ error: 'Failed to toggle attendance' }, { status: 500 });
  }
}
