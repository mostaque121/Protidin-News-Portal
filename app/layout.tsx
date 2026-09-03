import { getCategoriesWithSubcategories } from "@/actions/common-actions";
import { Toaster } from "@/components/ui/toast";
import { CategoryProvider } from "@/contexts/category-provider";
import { QueryProvider } from "@/contexts/query-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Hind_Siliguri, Noto_Serif_Bengali } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css"; // Ensure this path is correct for your root directory

const banglaSans = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bangla-sans",
});

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali"], // Noto Serif Bengali only supports "bengali"
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-serif-bengali",
});

export const metadata: Metadata = {
  title: "প্রতিদিন — সত্যের পক্ষে, মানুষের পাশে",
  description: "বাংলা সংবাদপত্র",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialCategories = await getCategoriesWithSubcategories();
  return (
    <html
      lang="bn"
      className={cn(notoSerifBengali.variable, banglaSans.variable)}
    >
      <QueryProvider>
        <CategoryProvider initialCategories={initialCategories ?? []}>
          <body className="min-h-screen bg-background text-foreground">
            <NextTopLoader
              color="oklch(0.5544 0.1869 27.52)" // your --primary
              height={3}
              showSpinner={false} // spinner clashes with a minimal admin UI; bar alone reads cleaner
              easing="ease"
              speed={300}
              initialPosition={0.4}
              shadow="0 0 8px oklch(0.5544 0.1869 27.52 / 40%)"
            />
            {children}
            <Toaster />
          </body>
        </CategoryProvider>
      </QueryProvider>
    </html>
  );
}
