import { getTeamMemberById, updateTeamMember, deleteTeamMember } from '@/controllers/teamController';

export async function GET(request, context) {
  return await getTeamMemberById(request, context);
}

export async function PUT(request, context) {
  return await updateTeamMember(request, context);
}

export async function DELETE(request, context) {
  return await deleteTeamMember(request, context);
}
