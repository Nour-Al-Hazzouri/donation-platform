// C:\Users\MC\Desktop\Donation\donation-platform\frontend\src\app\contactUs\page.tsx
import { MainLayout } from "@/components/layouts/MainLayout";
import ContactUs from "@/components/contactUs/contactUs";
import { ContactInfo } from "@/components/contactUs/contactInfo";

export default function ContactPage() {
  return (
    <MainLayout>
      <ContactInfo />
      <ContactUs />
    </MainLayout>
  );
}