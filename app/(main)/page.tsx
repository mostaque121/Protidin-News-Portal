import { getLatestNews } from "@/actions/news-action";
import { CategorySection } from "@/components/home/category-section";
import { HeroSection } from "@/components/home/hero-section";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const topNews = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    where: { status: "PUBLISHED", isTop: true },
    select: {
      id: true,
      title: true,
      publishedAt: true,
      coverImage: true,
      summary: true,
      reporter: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    take: 5,
  });

  const categoryWiseNews = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    take: 10,
    select: {
      id: true,
      name: true,
      slug: true,
      articles: {
        where: {
          status: "PUBLISHED",
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: 4,
        select: {
          id: true,
          title: true,
          summary: true,
          coverImage: true,
          publishedAt: true,
          reporter: true,
          isTop: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  const latestNews = await getLatestNews();

  return (
    <main className="mx-auto w-[calc(100%-28px)] py-5.5 sm:w-[min(1180px,calc(100%-48px))] sm:py-8.5 sm:pb-17.5">
      <HeroSection topNews={topNews} latestNews={latestNews} />
      {categoryWiseNews.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}
    </main>
  );
}
