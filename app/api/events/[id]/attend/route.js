import { toggleEventAttendance } from '@/controllers/eventController';

export async function POST(request, context) {
  return await toggleEventAttendance(request, context);
}
