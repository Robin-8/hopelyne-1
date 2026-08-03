import { deleteTopicReply } from '@/controllers/forumController';

export async function DELETE(request, context) {
  return await deleteTopicReply(request, context);
}
