// components/category-load-more.tsx
"use client";

import { fetchCategoryNews } from "@/actions/news-action";
import { NewsCard } from "@/components/news/news-card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface CategoryLoadMoreProps {
  categorySlug: string;
  subcategorySlug?: string;
  initialOffset: number;
  initialHasMore: boolean;
}

export function CategoryLoadMore({
  categorySlug,
  subcategorySlug,
  initialOffset,
  initialHasMore,
}: CategoryLoadMoreProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["category-news-more", categorySlug, subcategorySlug ?? "all"],
      queryFn: ({ pageParam = initialOffset }) =>
        fetchCategoryNews({
          categorySlug,
          subcategorySlug,
          offset: pageParam,
          limit: 10,
        }),
      initialPageParam: initialOffset,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextOffset : undefined,
      enabled: isEnabled,
    });

  const handleLoadMore = () => {
    if (!isEnabled) {
      setIsEnabled(true);
    } else {
      fetchNextPage();
    }
  };

  const canLoadMore = !isEnabled ? initialHasMore : hasNextPage;
  const isLoading = isFetching || isFetchingNextPage;
  const loadedNews = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="mt-6.25 space-y-6.25">
      {/* Grid for client-loaded items */}
      {loadedNews.length > 0 && (
        <div className="grid grid-cols-2 gap-4.5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6.25">
          {loadedNews.map((item) => (
            <div
              key={item.id}
              className="border-b border-border pb-4.5 last:border-b-0"
            >
              <NewsCard item={item} featured={false} layout="grid" />
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {canLoadMore && (
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoading}
            className="inline-flex cursor-pointer items-center justify-center border border-border bg-paper px-6 py-2.5 text-xs font-bold text-navy transition-colors hover:bg-muted disabled:opacity-50 rounded-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                লোড হচ্ছে...
              </>
            ) : (
              "আরও সংবাদ দেখুন"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
