import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id: eventId } = await params;
    const userId = session.user.id;

    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    // Check if attendance record already exists
    const existingAttendance = await prisma.eventAttendance.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId
        }
      }
    });

    let attendance;
    if (existingAttendance) {
      attendance = await prisma.eventAttendance.update({
        where: { id: existingAttendance.id },
        data: { attending: !existingAttendance.attending }
      });
    } else {
      attendance = await prisma.eventAttendance.create({
        data: {
          eventId,
          userId,
          attending: true
        }
      });
    }

    // Get new count
    const count = await prisma.eventAttendance.count({
      where: {
        eventId,
        attending: true
      }
    });

    return NextResponse.json({
      attending: attendance.attending,
      attendanceCount: count
    });
  } catch (error) {
    console.error('Attendance POST error:', error);
    return NextResponse.json({ error: 'Failed to toggle attendance' }, { status: 500 });
  }
}
