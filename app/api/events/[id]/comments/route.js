import { getEventComments, createEventComment } from '@/controllers/eventController';

export async function GET(request, context) {
  return await getEventComments(request, context);
}

export async function POST(request, context) {
  return await createEventComment(request, context);
}
