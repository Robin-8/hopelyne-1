import { getEvents, createEvent } from '@/controllers/eventController';

export async function GET(request) {
  return await getEvents(request);
}

export async function POST(request) {
  return await createEvent(request);
}
