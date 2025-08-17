'use client'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { MainLayout } from "@/components/layouts/MainLayout";
import { Hero } from "@/components/home/Hero";
import LatestDonations from "@/components/home/latestDonations";
import LatestRequests from "@/components/home/latestRequests";
import ContactUs from "@/components/contactUs/contactUs";
import AboutIntroSection from "@/components/aboutUs/AboutIntroSection";
import BlogCarousel from "@/components/blog/BlogCarousel";

export default function HomeClient() {
  return (
    <MainLayout>
      <Hero />
      <AboutIntroSection showButton={false} />
      <LatestDonations />
      <LatestRequests />
      <BlogCarousel />
      <ContactUs />
    </MainLayout>
  );
}