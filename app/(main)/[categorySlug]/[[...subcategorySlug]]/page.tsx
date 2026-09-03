import { getCategoriesWithSubcategories } from "@/actions/common-actions";
import { getCategoryNews, getLatestNews } from "@/actions/news-action";

import { CategoryLoadMore } from "@/components/category/category-page-client";
import { LatestNews } from "@/components/news/latest-news";
import { NewsCard } from "@/components/news/news-card";
import Link from "next/link";
import { notFound } from "next/navigation";

type CategoryPageProps = {
  params: Promise<{
    categorySlug: string;
    subcategorySlug?: string[];
  }>;
};

export async function generateStaticParams() {
  const categories = await getCategoriesWithSubcategories();

  const params: Array<{ categorySlug: string; subcategorySlug?: string[] }> =
    [];

  for (const category of categories) {
    // Generates base category route (e.g. /international)
    params.push({
      categorySlug: category.slug,
      subcategorySlug: [],
    });

    // Generates subcategory routes (e.g. /international/india)
    for (const subcategory of category.subcategories) {
      params.push({
        categorySlug: category.slug,
        subcategorySlug: [subcategory.slug],
      });
    }
  }

  return params;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug, subcategorySlug: subcategoryPath } = await params;

  // Only one optional subcategory is supported:
  // /international
  // /international/india
  if (subcategoryPath && subcategoryPath.length > 1) {
    notFound();
  }

  const subcategorySlug = subcategoryPath?.[0];

  const {
    items: initialArticles,
    categoryData,
    hasMore,
  } = await getCategoryNews({
    categorySlug,
    subcategorySlug,
    offset: 0,
    limit: 10,
  });
  const latestNews = await getLatestNews();
  const activeSubcategory = categoryData.subcategories.find(
    (subcategory) => subcategory.slug === subcategorySlug,
  );

  return (
    <main className="mx-auto w-[calc(100%-28px)] py-5.5 sm:w-[min(1180px,calc(100%-48px))] sm:py-8.5 sm:pb-17.5">
      {/* Category Header */}
      <header className="mb-6 border-b border-border pb-4.5">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="size-3 rounded-full bg-primary" />

          <h1 className="flex items-center gap-1.5 text-3xl font-bold leading-none text-navy sm:text-4xl">
            <span>{categoryData.name}</span>

            {activeSubcategory && (
              <>
                <span
                  aria-hidden="true"
                  className="text-xs text-navy/80 sm:text-sm"
                >
                  ▶
                </span>

                <span className="text-xl font-normal text-muted-foreground sm:text-2xl">
                  {activeSubcategory.name}
                </span>
              </>
            )}
          </h1>
        </div>

        {/* Subcategory Navigation */}
        {categoryData.subcategories.length > 0 && (
          <nav
            className="mt-4.5 flex flex-wrap gap-2"
            aria-label={`${categoryData.name} উপবিভাগ`}
          >
            {/* All Articles */}
            <Link
              href={`/${categoryData.slug}`}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                !subcategorySlug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-[#c9bfb0] bg-[#f8f1e7] text-navy hover:border-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              সব
            </Link>

            {categoryData.subcategories.map((subcategory) => {
              const isActive = subcategory.slug === subcategorySlug;

              return (
                <Link
                  key={subcategory.slug}
                  href={`/${categoryData.slug}/${subcategory.slug}`}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-[#c9bfb0] bg-[#f8f1e7] text-navy hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {subcategory.name}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* News Content */}
      <div className="grid gap-8.5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          {/* Initial Server-Rendered Articles */}
          <div className="grid grid-cols-2 gap-4.5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6.25">
            {initialArticles.map((article, index) => (
              <div
                key={article.id}
                className={
                  index === 0
                    ? "col-span-2 border-b border-border pb-5 sm:col-span-3"
                    : "border-b border-border pb-4.5 last:border-b-0"
                }
              >
                <NewsCard
                  item={article}
                  featured={index === 0}
                  layout={index === 0 ? "split" : "grid"}
                  subcategoryName={activeSubcategory?.name}
                />
              </div>
            ))}
          </div>

          {/* Client-Side Pagination */}
          <CategoryLoadMore
            categorySlug={categorySlug}
            subcategorySlug={subcategorySlug}
            initialOffset={initialArticles.length}
            initialHasMore={hasMore}
          />
        </section>

        {/* Latest News Sidebar */}
        <LatestNews items={latestNews} />
      </div>
    </main>
  );
}
