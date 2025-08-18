import { use } from "react"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import VerificationDetailsPageClient from "@/components/admin/users/verification/VerificationDetailsPageClient"

export default function VerificationRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use() to avoid the warning
  const { id } = use(params)
  const verificationId = parseInt(id)

  return (
    <AdminLayout>
      <VerificationDetailsPageClient verificationId={verificationId} />
    </AdminLayout>
  )
}