import { getResources, createResource } from '@/controllers/resourceController';

export async function GET(request) {
  return await getResources(request);
}

export async function POST(request) {
  return await createResource(request);
}
