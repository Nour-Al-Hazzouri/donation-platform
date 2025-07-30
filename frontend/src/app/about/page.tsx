import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import AboutUs from '@/components/aboutUs/aboutUs'

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <AboutUs />
      </div>
      <Footer />
    </main>
  )
}