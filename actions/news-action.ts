"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getLatestNews = unstable_cache(
  async () => {
    return await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        publishedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        publishedAt: true,
      },
      take: 6,
    });
  },
  ["latest-news"], // Unique cache key
  {
    tags: ["latest-news"], // Tag used to invalidate cache on demand
  },
);

export const getLatestTopNews = unstable_cache(
  async () => {
    return prisma.article.findFirst({
      where: {
        status: "PUBLISHED",
        isTop: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        publishedAt: true,
      },
    });
  },
  ["latest-top-news"],
  {
    tags: ["latest-top-news"],
  },
);

const articleSelect = {
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
} as const;

export async function getCategoryNews({
  categorySlug,
  subcategorySlug,
  offset = 0,
  limit = 6,
}: {
  categorySlug: string;
  subcategorySlug?: string;
  offset?: number;
  limit?: number;
}) {
  // Dynamic tags array based on context
  const tags = [
    "category-news",
    `category-${categorySlug}`, // Revalidates category + ALL its subcategories
    ...(subcategorySlug
      ? [`subcategory-${subcategorySlug}`] // Revalidates ONLY this subcategory
      : [`category-only-${categorySlug}`]), // Revalidates ONLY main category (no subcategory selected)
  ];

  return unstable_cache(
    async () => {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
        select: {
          name: true,
          slug: true,
          subcategories: {
            select: { name: true, slug: true },
            orderBy: { sortOrder: "asc" },
          },
          articles: {
            where: {
              status: "PUBLISHED",
              ...(subcategorySlug && {
                subcategory: { slug: subcategorySlug },
              }),
            },
            select: articleSelect,
            orderBy: { publishedAt: "desc" },
            skip: offset,
            take: limit + 1,
          },
        },
      });

      const articles = category?.articles ?? [];
      const hasMore = articles.length > limit;
      const items = hasMore ? articles.slice(0, limit) : articles;

      return {
        items,
        nextOffset: offset + items.length,
        hasMore,
        categoryData: {
          name: category?.name ?? "",
          slug: categorySlug,
          subcategories: category?.subcategories ?? [],
        },
      };
    },
    [
      "category-news",
      categorySlug,
      subcategorySlug || "all",
      String(offset),
      String(limit),
    ],
    { tags },
  )();
}

export async function fetchCategoryNews({
  categorySlug,
  subcategorySlug,
  offset = 0,
  limit = 6,
}: {
  categorySlug: string;
  subcategorySlug?: string;
  offset?: number;
  limit?: number;
}) {
  const category = await prisma.category.findUnique({
    where: {
      slug: categorySlug,
    },
    select: {
      name: true,
      slug: true,
      subcategories: {
        select: {
          name: true,
          slug: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
      articles: {
        where: {
          status: "PUBLISHED",
          ...(subcategorySlug && {
            subcategory: {
              slug: subcategorySlug,
            },
          }),
        },
        select: articleSelect,
        orderBy: {
          publishedAt: "desc",
        },
        skip: offset,
        take: limit + 1,
      },
    },
  });

  const articles = category?.articles ?? [];

  const hasMore = articles.length > limit;

  const items = hasMore ? articles.slice(0, limit) : articles;
  const categoryData = {
    name: category?.name ?? "",
    slug: categorySlug,
    subcategories: category?.subcategories ?? [],
  };

  return {
    items,
    nextOffset: offset + items.length,
    hasMore,
    categoryData,
  };
}

export async function getRelatedNews({
  categoryId,
  subcategoryId,
  articleId,
}: {
  categoryId: string;
  subcategoryId?: string;
  articleId: string;
}) {
  // Tier 1: Fetch articles in the same subcategory
  const subcategoryArticles = subcategoryId
    ? await prisma.article.findMany({
        where: {
          id: { not: articleId },
          status: "PUBLISHED",
          subcategoryId: subcategoryId,
        },
        select: articleSelect,
        orderBy: { publishedAt: "desc" },
        take: 6,
      })
    : [];

  let items = [...subcategoryArticles];

  // Tier 2: Fill remaining slots with articles from the same parent category
  if (items.length < 6) {
    const excludedIds = [articleId, ...items.map((item) => item.id)];
    const categoryArticles = await prisma.article.findMany({
      where: {
        id: { notIn: excludedIds },
        status: "PUBLISHED",
        categoryId: categoryId,
      },
      select: articleSelect,
      orderBy: { publishedAt: "desc" },
      take: 6 - items.length,
    });

    items = [...items, ...categoryArticles];
  }

  // Tier 3: Fallback to general latest published news if total is still under 6
  if (items.length < 6) {
    const excludedIds = [articleId, ...items.map((item) => item.id)];
    const fallbackArticles = await prisma.article.findMany({
      where: {
        id: { notIn: excludedIds },
        status: "PUBLISHED",
      },
      select: articleSelect,
      orderBy: { publishedAt: "desc" },
      take: 6 - items.length,
    });

    items = [...items, ...fallbackArticles];
  }

  return items;
}

export async function searchArticlesByTitle(query: string) {
  const sanitizedQuery = query.trim();
  if (!sanitizedQuery || sanitizedQuery.length < 4) {
    return [];
  }

  return await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      title: {
        contains: sanitizedQuery,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      title: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 5,
  });
}
