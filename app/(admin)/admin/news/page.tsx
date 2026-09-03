import {
  getAdminArticlesAction,
  getAdminArticleStatsAction,
} from "@/actions/article-actions";
import { NewsPageClient } from "@/components/admin/news/news-page-client";

interface NewsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    categoryId?: string;
    subcategoryId?: string;
    month?: string;
    page?: string;
  }>;
}

export default async function AdminNewsPage({ searchParams }: NewsPageProps) {
  const resolvedParams = await searchParams;

  const initialFilters = {
    search: resolvedParams.search ?? "",
    status: resolvedParams.status ?? "",
    categoryId: resolvedParams.categoryId ?? "",
    subcategoryId: resolvedParams.subcategoryId ?? "",
    month: resolvedParams.month ?? "",
    page: Number(resolvedParams.page) || 1,
  };

  const [initialArticles, initialStats] = await Promise.all([
    getAdminArticlesAction(initialFilters),
    getAdminArticleStatsAction(),
  ]);

  return (
    <NewsPageClient
      initialArticles={initialArticles}
      initialStats={initialStats}
      initialFilters={initialFilters}
    />
  );
}
