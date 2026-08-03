import { getUsers, createUser } from '@/controllers/userController';

export async function GET(request) {
  return await getUsers(request);
}

export async function POST(request) {
  return await createUser(request);
}
