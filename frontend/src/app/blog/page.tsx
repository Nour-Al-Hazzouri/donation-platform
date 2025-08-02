import { MainLayout } from "@/components/layouts/MainLayout";
import NewsBlogSection from "@/components/blog/NewsBlogSection";

export const metadata = {
  title: "Blog - Lebanon Donation Platform",
  description: "Latest news, updates, and stories from our donation platform.",
};

export default function BlogPage() {
  return (
    <MainLayout>
      <div className="pt-16">
        <NewsBlogSection />
      </div>
    </MainLayout>
  );
}