import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as eventModel from '@/models/eventModel';

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

export async function createEvent(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('EVENTS_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const event = await eventModel.createEvent(body);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Events POST error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
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
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('EVENTS_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const event = await eventModel.updateEvent(id, body);
    return NextResponse.json(event);
  } catch (error) {
    console.error('Event PUT error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function deleteEvent(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('EVENTS_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await eventModel.deleteEvent(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
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
    const { content, rating, userName } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const comment = await eventModel.createEventComment({
      eventId,
      userId,
      userName: userName || session.user.name || 'Anonymous',
      content,
      rating: rating ? parseInt(rating) : null
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

    const event = await eventModel.getEventById(eventId);
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const result = await eventModel.toggleEventAttendance(eventId, userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Attendance POST error:', error);
    return NextResponse.json({ error: 'Failed to toggle attendance' }, { status: 500 });
  }
}
