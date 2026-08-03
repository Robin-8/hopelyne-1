import prisma from '@/lib/prisma';

export async function getResources(where = {}) {
  return await prisma.usefulResource.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
}

export async function getResourceById(id) {
  return await prisma.usefulResource.findUnique({ where: { id } });
}

export async function createResource(data) {
  return await prisma.usefulResource.create({ data });
}

export async function updateResource(id, data) {
  return await prisma.usefulResource.update({
    where: { id },
    data
  });
}

export async function deleteResource(id) {
  return await prisma.usefulResource.delete({ where: { id } });
}
