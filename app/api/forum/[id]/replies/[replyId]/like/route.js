import { toggleReplyLike } from '@/controllers/forumController';

export async function POST(request, context) {
  return await toggleReplyLike(request, context);
}
