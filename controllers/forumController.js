import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as forumModel from '@/models/forumModel';
import {
  validate,
  createTopicSchema,
  updateTopicSchema,
  createReplySchema,
} from '@/lib/validation';

export async function getTopics(request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limitParam = searchParams.get('limit');
    const cursor = searchParams.get('cursor') || undefined;
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 100) : 50;

    const where = {};
    if (!showAll && status) where.status = status;
    else if (!showAll && !status) where.status = 'APPROVED';
    if (category) where.category = category;

    const topics = await forumModel.getForumTopics(where, { limit, cursor });
    return NextResponse.json(topics);
  } catch (error) {
    console.error('Forum GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
}

export async function createTopic(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { data, error } = validate(createTopicSchema, body);
    if (error) return error;

    const topic = await forumModel.createForumTopic({
      title: data.title,
      content: data.content,
      category: data.category,
      status: 'PENDING',
      authorId: session.user.id,
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error('Forum POST error:', error);
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 });
  }
}

export async function getTopicById(request, { params }) {
  try {
    const { id } = await params;
    const topic = await forumModel.getForumTopicById(id);

    if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(topic);
  } catch (error) {
    console.error('Forum GET by id error:', error);
    return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 });
  }
}

export async function updateTopic(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('FORUM_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { data, error } = validate(updateTopicSchema, body);
    if (error) return error;

    const topic = await forumModel.updateForumTopic(id, { status: data.status });
    return NextResponse.json(topic);
  } catch (error) {
    console.error('Forum PUT error:', error);
    return NextResponse.json({ error: 'Failed to update topic' }, { status: 500 });
  }
}

export async function deleteTopic(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('FORUM_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await forumModel.deleteForumTopic(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forum DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 });
  }
}

export async function getTopicReplies(request, { params }) {
  try {
    const { id: topicId } = await params;
    const replies = await forumModel.getForumRepliesByTopicId(topicId);

    return NextResponse.json(replies);
  } catch (error) {
    console.error('Forum replies GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}

export async function createTopicReply(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: topicId } = await params;
    const body = await request.json();
    const { data, error } = validate(createReplySchema, body);
    if (error) return error;

    const reply = await forumModel.createForumReply({
      content: data.content,
      topicId,
      authorId: session.user.id,
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error('Forum replies POST error:', error);
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 });
  }
}

export async function deleteTopicReply(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = session.user.roles || [];
    if (!roles.includes('SUPER_ADMIN') && !roles.includes('FORUM_MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { replyId } = await params;
    await forumModel.deleteForumReply(replyId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forum reply DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete reply' }, { status: 500 });
  }
}

export async function toggleReplyLike(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { replyId } = await params;
    const userId = session.user.id;

    const result = await forumModel.toggleReplyLike(replyId, userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Like reply error:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
