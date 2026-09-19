import prisma from '@/lib/prisma';

const AUTHOR_SELECT = {
  select: { id: true, name: true, avatar: true },
};

export async function getForumTopics(where = {}, { limit, cursor } = {}) {
  const take = limit ? Math.min(limit, 100) : 50;
  return await prisma.forumTopic.findMany({
    where,
    include: {
      author: AUTHOR_SELECT,
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: 'desc' },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });
}

export async function getForumTopicById(id) {
  return await prisma.forumTopic.findUnique({
    where: { id },
    include: {
      author: AUTHOR_SELECT,
      replies: {
        include: {
          author: AUTHOR_SELECT,
          likes: { select: { userId: true, replyId: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

export async function createForumTopic(data) {
  return await prisma.forumTopic.create({ data });
}

export async function updateForumTopic(id, data) {
  return await prisma.forumTopic.update({ where: { id }, data });
}

export async function deleteForumTopic(id) {
  // Manual delete is kept intentionally: Prisma MongoDB may not enforce cascade at the DB level
  await prisma.forumReply.deleteMany({ where: { topicId: id } });
  return await prisma.forumTopic.delete({ where: { id } });
}

export async function getForumRepliesByTopicId(topicId) {
  return await prisma.forumReply.findMany({
    where: { topicId },
    include: { author: AUTHOR_SELECT },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createForumReply(data) {
  return await prisma.forumReply.create({ data });
}

export async function deleteForumReply(replyId) {
  return await prisma.forumReply.delete({ where: { id: replyId } });
}

export async function toggleReplyLike(replyId, userId) {
  // Check and toggle in 2 queries (findUnique + delete/create, then count)
  const existingLike = await prisma.replyLike.findUnique({
    where: { replyId_userId: { replyId, userId } },
    select: { replyId: true },
  });

  if (existingLike) {
    await prisma.replyLike.delete({
      where: { replyId_userId: { replyId, userId } },
    });
  } else {
    await prisma.replyLike.create({ data: { replyId, userId } });
  }

  const likeCount = await prisma.replyLike.count({ where: { replyId } });

  return { liked: !existingLike, likeCount };
}
