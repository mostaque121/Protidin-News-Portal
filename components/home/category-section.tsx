import { NewsCard } from "@/components/news/news-card";
import { SectionHeading } from "@/components/section-heading";

type NewsItem = {
  id: string;
  title: string;
  summary: string | null;
  coverImage: string | null;
  publishedAt: Date;
  reporter: string | null;
  isTop: boolean;
  category: {
    name: string;
    slug: string;
  };
};

type CategoryWithNews = {
  id: string;
  name: string;
  slug: string;
  articles: NewsItem[];
};

export function CategorySection({ category }: { category: CategoryWithNews }) {
  // If a category has no news articles, skip rendering the section
  if (!category.articles || category.articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-9.5 py-4.25 sm:py-6">
      <SectionHeading
        title={category.name}
        href={`/category/${encodeURIComponent(category.slug)}`}
      />
      <div className="grid grid-cols-2 gap-4.5 sm:grid-cols-4 sm:gap-5.5">
        {category.articles.map((item) => (
          <div key={item.id} className="bg-paper pb-3">
            <NewsCard item={item} padded />
          </div>
        ))}
      </div>
    </section>
  );
}
