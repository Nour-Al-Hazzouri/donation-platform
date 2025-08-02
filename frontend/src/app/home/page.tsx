// C:\Users\MC\Desktop\Donation\donation-platform\frontend\src\app\home\page.tsx
import { MainLayout } from "@/components/layouts/MainLayout";
import { Hero } from "@/components/home/Hero";
import LatestDonations from "@/components/home/latestDonations";
import LatestRequests from "@/components/home/latestRequests";
import ContactUs from "@/components/contactUs/contactUs";
import AboutIntroSection from "@/components/aboutUs/AboutIntroSection";
import BlogCarousel from "@/components/blog/BlogCarousel";

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <AboutIntroSection />
      <LatestDonations />
      <LatestRequests />
      <BlogCarousel />
      <ContactUs />
    </MainLayout>
  );
}