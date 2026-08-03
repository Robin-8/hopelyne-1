import prisma from '@/lib/prisma';

export async function getTeamMembers() {
  return await prisma.teamMember.findMany({
    orderBy: { displayOrder: 'asc' }
  });
}

export async function getTeamMemberById(id) {
  return await prisma.teamMember.findUnique({ where: { id } });
}

export async function createTeamMember(data) {
  return await prisma.teamMember.create({ data });
}

export async function updateTeamMember(id, data) {
  return await prisma.teamMember.update({
    where: { id },
    data
  });
}

export async function deleteTeamMember(id) {
  return await prisma.teamMember.delete({ where: { id } });
}
