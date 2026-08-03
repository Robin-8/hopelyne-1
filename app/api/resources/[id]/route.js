import { getResourceById, updateResource, deleteResource } from '@/controllers/resourceController';

export async function GET(request, context) {
  return await getResourceById(request, context);
}

export async function PUT(request, context) {
  return await updateResource(request, context);
}

export async function DELETE(request, context) {
  return await deleteResource(request, context);
}
