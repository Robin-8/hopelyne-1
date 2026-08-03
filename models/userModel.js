import prisma from '@/lib/prisma';

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      roles: true,
      createdAt: true,
    }
  });
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, image: true, roles: true, createdAt: true }
  });
}

export async function createUser(data) {
  return await prisma.user.create({
    data,
    select: { id: true, email: true, name: true, roles: true }
  });
}

export async function updateUser(id, updateData) {
  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, email: true, name: true, roles: true }
  });
}

export async function deleteUser(id) {
  return await prisma.user.delete({ where: { id } });
}
