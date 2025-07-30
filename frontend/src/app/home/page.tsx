import { MainLayout } from "@/components/layouts/MainLayout";
import { Hero } from "@/components/home/Hero";
import AboutUs from "@/components/home/aboutUs";
import LatestDonations from "@/components/home/latestDonations";
import LatestRequests from "@/components/home/latestRequests";
import ContactUs from "@/components/contactUs/contactUs";

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <AboutUs />
      <LatestDonations />
      <LatestRequests />
      <ContactUs />
    </MainLayout>
  );
}