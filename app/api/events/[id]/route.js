import { getEventById, updateEvent, deleteEvent } from '@/controllers/eventController';

export async function GET(request, context) {
  return await getEventById(request, context);
}

export async function PUT(request, context) {
  return await updateEvent(request, context);
}

export async function DELETE(request, context) {
  return await deleteEvent(request, context);
}
