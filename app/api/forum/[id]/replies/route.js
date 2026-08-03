import { getTopicReplies, createTopicReply } from '@/controllers/forumController';

export async function GET(request, context) {
  return await getTopicReplies(request, context);
}

export async function POST(request, context) {
  return await createTopicReply(request, context);
}
