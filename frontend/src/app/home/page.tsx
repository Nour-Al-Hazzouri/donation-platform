// src/app/home/page.tsx
import { MainLayout } from "@/components/layouts/MainLayout";
import { Hero } from "@/components/home/Hero";
import AboutUs from "@/components/home/aboutUs";
import LatestDonations from "@/components/home/latestDonations";

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <AboutUs />
      <LatestDonations />
    </MainLayout>
  );
}