import { LatestNews } from "@/components/news/latest-news";
import { NewsCard } from "@/components/news/news-card";

type NewsItem = {
  id: string;
  category: {
    name: string;
    slug: string;
  };
  isTop?: boolean;
  title: string;
  summary: string | null;
  publishedAt: Date;
  reporter: string | null;
  coverImage: string | null;
};

type latestNewsItem = {
  id: string;
  title: string;
  publishedAt: Date;
};

export function HeroSection({
  topNews,
  latestNews,
}: {
  topNews: NewsItem[];
  latestNews: latestNewsItem[];
}) {
  // Finds the first item marked as top news; falls back to the latest item if none exist
  const lead = topNews[0];

  // Remaining 4 items excluding the lead item
  const rest = topNews.filter((item) => item.id !== lead.id).slice(0, 4);

  if (!lead) return null;

  return (
    <div className="grid gap-5 border-b border-border pb-9.5 lg:grid-cols-[1.15fr_1.55fr_.9fr]">
      <div>
        <NewsCard item={lead} featured />
      </div>
      <div className="grid grid-cols-2 content-start gap-4.75 sm:grid-cols-2">
        {rest.map((item) => (
          <div key={item.id} className="border-b border-border pb-3.5">
            <NewsCard item={item} />
          </div>
        ))}
      </div>
      <LatestNews items={latestNews} />
    </div>
  );
}
