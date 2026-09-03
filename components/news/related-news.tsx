"use client";

import { getRelatedNews } from "@/actions/news-action";
import { formatTimeAgo } from "@/lib/format-time";
import { useQuery } from "@tanstack/react-query";
import { Clock3, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "../section-heading";

type RelatedNewsProps = {
  categoryId: string;
  subcategoryId?: string;
  articleId: string;
};

export function RelatedNews({
  categoryId,
  subcategoryId,
  articleId,
}: RelatedNewsProps) {
  const {
    data: items,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["related-news", articleId, categoryId, subcategoryId ?? ""],
    queryFn: () =>
      getRelatedNews({
        categoryId,
        subcategoryId,
        articleId,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <aside className="self-start">
        <SectionHeading title="সম্পর্কিত সংবাদ" />
        <div className="flex flex-col">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-3 border-b border-border py-3 animate-pulse"
            >
              <div className="h-16 w-20 shrink-0 rounded-sm bg-muted" />
              <div className="flex flex-1 flex-col justify-center space-y-2">
                <div className="h-3.5 w-full rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  if (isError || !items || items.length === 0) {
    return null;
  }

  return (
    <aside className="self-start">
      <SectionHeading title="সম্পর্কিত সংবাদ" />
      <div className="flex flex-col">
        {items.slice(0, 6).map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className="group flex gap-3 border-b border-border py-3 last:border-b-0"
          >
            {/* Left side Image */}
            <div className="relative h-16 w-20 shrink-0 overflow-hidden  bg-muted">
              {item.coverImage ? (
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                  <Newspaper className="size-5" />
                </div>
              )}
            </div>

            {/* Right side details */}
            <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
              <strong className="line-clamp-2 text-[13px] font-bold leading-[1.4] text-navy transition-colors duration-200 group-hover:text-primary">
                {item.title}
              </strong>
              <small className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock3 size={12} />
                {formatTimeAgo(item.publishedAt)}
              </small>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
