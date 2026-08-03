import prisma from '@/lib/prisma';

export async function getForumTopics(where = {}) {
  return await prisma.forumTopic.findMany({
    where,
    include: {
      author: true,
      _count: { select: { replies: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getForumTopicById(id) {
  return await prisma.forumTopic.findUnique({
    where: { id },
    include: {
      author: true,
      replies: {
        include: {
          author: true,
          likes: true,
          _count: { select: { likes: true } }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });
}

export async function createForumTopic(data) {
  return await prisma.forumTopic.create({ data });
}

export async function updateForumTopic(id, data) {
  return await prisma.forumTopic.update({
    where: { id },
    data
  });
}

export async function deleteForumTopic(id) {
  await prisma.forumReply.deleteMany({ where: { topicId: id } });
  return await prisma.forumTopic.delete({ where: { id } });
}

export async function getForumRepliesByTopicId(topicId) {
  return await prisma.forumReply.findMany({
    where: { topicId },
    include: { author: true },
    orderBy: { createdAt: 'asc' }
  });
}

export async function createForumReply(data) {
  return await prisma.forumReply.create({ data });
}

export async function deleteForumReply(replyId) {
  return await prisma.forumReply.delete({ where: { id: replyId } });
}

export async function findReplyLike(replyId, userId) {
  return await prisma.replyLike.findUnique({
    where: {
      replyId_userId: { replyId, userId }
    }
  });
}

export async function toggleReplyLike(replyId, userId) {
  const existingLike = await findReplyLike(replyId, userId);

  if (existingLike) {
    await prisma.replyLike.delete({
      where: {
        replyId_userId: { replyId, userId }
      }
    });
  } else {
    await prisma.replyLike.create({
      data: { replyId, userId }
    });
  }

  const likeCount = await prisma.replyLike.count({
    where: { replyId }
  });

  return {
    liked: !existingLike,
    likeCount
  };
}
