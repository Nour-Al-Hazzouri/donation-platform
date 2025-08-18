export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { AdminLayout } from "@/components/layouts/AdminLayout"
import VerificationRequestDetailsClient from "@/components/admin/verification-requests/VerificationRequestDetailsClient"

type PageParams = {
  id: string
}

type PageProps = {
  params: Promise<PageParams>
}

export default async function VerificationRequestDetailsPage(props: PageProps) {
  const { id } = await props.params

  return (
    <AdminLayout>
      <VerificationRequestDetailsClient id={id} />
    </AdminLayout>
  )
}