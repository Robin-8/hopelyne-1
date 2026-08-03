import { getTeamMembers, createTeamMember } from '@/controllers/teamController';

export async function GET(request) {
  return await getTeamMembers(request);
}

export async function POST(request) {
  return await createTeamMember(request);
}
