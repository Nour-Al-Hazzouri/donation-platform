import { UserVerificationPageClient } from '../[id]/UserVerificationPageClient';

export default function VerificationRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return <UserVerificationPageClient params={params} />;
}
