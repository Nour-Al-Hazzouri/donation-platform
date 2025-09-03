import { VerificationRequestDetailsPageClient } from './VerificationRequestDetailsPageClient';

export default function VerificationRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return <VerificationRequestDetailsPageClient params={params} />;
}