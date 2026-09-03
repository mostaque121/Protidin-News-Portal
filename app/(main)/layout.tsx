import { getLatestTopNews } from "@/actions/news-action";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Metadata } from "next";

// Optional: Override root metadata if needed, otherwise you can remove this block
export const metadata: Metadata = {
  title: "প্রতিদিন — সত্যের পক্ষে, মানুষের পাশে",
  description: "বাংলা সংবাদপত্র",
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lastNews = await getLatestTopNews();
  return (
    <>
      <SiteHeader lastNews={lastNews} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
