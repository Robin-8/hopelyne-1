import { getUserById, updateUser, deleteUser } from '@/controllers/userController';

export async function GET(request, context) {
  return await getUserById(request, context);
}

export async function PUT(request, context) {
  return await updateUser(request, context);
}

export async function DELETE(request, context) {
  return await deleteUser(request, context);
}
