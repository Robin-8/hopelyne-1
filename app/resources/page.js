// Server Component — fetches data server-side, no useEffect waterfall
import { getResources } from '@/models/resourceModel';
import ResourcesClient from './ResourcesClient';

export const dynamic = 'force-dynamic';

export default async function Resources() {
  // Direct model access — no internal HTTP round-trip
  const resources = await getResources();

  return <ResourcesClient resources={resources} />;
}
