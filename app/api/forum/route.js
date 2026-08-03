import { getTopics, createTopic } from '@/controllers/forumController';

export async function GET(request) {
  return await getTopics(request);
}

export async function POST(request) {
  return await createTopic(request);
}
