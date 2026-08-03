import { getTopicById, updateTopic, deleteTopic } from '@/controllers/forumController';

export async function GET(request, context) {
  return await getTopicById(request, context);
}

export async function PUT(request, context) {
  return await updateTopic(request, context);
}

export async function DELETE(request, context) {
  return await deleteTopic(request, context);
}
