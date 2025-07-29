import { MainLayout } from "@/components/layouts/MainLayout"
import { Hero } from "@/components/common/Hero"
import { ImageCollage } from "@/components/common/ImageCollage"
import { CallToAction } from "@/components/common/CallToAction"

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <ImageCollage />
      <CallToAction />
    </MainLayout>
  )
}
