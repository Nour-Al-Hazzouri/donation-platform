import { Suspense } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Hero } from "@/components/home/Hero";
import LatestDonations from "@/components/home/latestDonations";
import LatestRequests from "@/components/home/latestRequests";
import ContactUs from "@/components/contactUs/contactUs";
import AboutIntroSection from "@/components/aboutUs/AboutIntroSection";
import BlogCarousel from "@/components/blog/BlogCarousel";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainLayout>
        <Hero />
        <AboutIntroSection showButton={false} />
        <LatestDonations />
        <LatestRequests />
        <BlogCarousel />
        <ContactUs />
      </MainLayout>
    </Suspense>
  );
}