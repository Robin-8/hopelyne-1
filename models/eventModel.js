import prisma from '@/lib/prisma';

export async function getEvents({ where = {}, orderBy = { date: 'asc' } } = {}) {
  return await prisma.event.findMany({ where, orderBy });
}

export async function getEventById(id) {
  return await prisma.event.findUnique({
    where: { id },
    include: {
      attendances: true,
      comments: { orderBy: { createdAt: 'desc' } },
      _count: { select: { attendances: { where: { attending: true } } } }
    }
  });
}

export async function createEvent(data) {
  return await prisma.event.create({ data });
}

export async function updateEvent(id, data) {
  return await prisma.event.update({ where: { id }, data });
}

export async function deleteEvent(id) {
  return await prisma.event.delete({ where: { id } });
}

export async function getEventComments(eventId) {
  return await prisma.eventComment.findMany({
    where: { eventId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createEventComment(data) {
  return await prisma.eventComment.create({ data });
}

export async function toggleEventAttendance(eventId, userId) {
  const existingAttendance = await prisma.eventAttendance.findUnique({
    where: {
      eventId_userId: { eventId, userId }
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
      data: { eventId, userId, attending: true }
    });
  }

  const count = await prisma.eventAttendance.count({
    where: { eventId, attending: true }
  });

  return {
    attending: attendance.attending,
    attendanceCount: count
  };
}
