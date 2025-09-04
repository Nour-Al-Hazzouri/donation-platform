import { Suspense } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import ContactUs from "@/components/contactUs/contactUs";
import { ContactInfo } from "@/components/contactUs/contactInfo";

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainLayout>
        <ContactInfo />
        <ContactUs />
      </MainLayout>
    </Suspense>
  );
}