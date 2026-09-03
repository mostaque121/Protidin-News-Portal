import { formatTimeAgo } from "@/lib/format-time";
import { Clock3, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type NewsItem = {
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

export function NewsCard({
  item,
  featured = false,
  layout = "grid",
  padded = false,
  subcategoryName,
}: {
  item: NewsItem;
  featured?: boolean;
  layout?: "grid" | "row" | "split";
  padded?: boolean;
  subcategoryName?: string;
}) {
  if (layout === "row") {
    return (
      <Link
        href={`/news/${item.id}`}
        className="grid grid-cols-[100px_1fr] gap-2.5 border-b border-border py-2.5 last:border-b-0"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {item.coverImage ? (
            <Image
              src={item.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="100px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
              <Newspaper className="size-8" />
            </div>
          )}
        </div>
        <h3 className="text-[13px] font-bold leading-[1.35] text-navy">
          {item.title}
        </h3>
      </Link>
    );
  }

  return (
    <Link
      href={`/news/${item.id}`}
      className={`group block min-w-0 ${
        layout === "split" ? "grid gap-5 sm:grid-cols-[1.1fr_1fr]" : ""
      }`}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {item.coverImage ? (
          <Image
            src={item.coverImage}
            alt=""
            fill
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(.25,.8,.25,1)] group-hover:scale-[1.04]"
            sizes="(min-width: 900px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <Newspaper className="size-12" />
          </div>
        )}

        {/* Breaking News Badge */}
        {item.isTop && (
          <span className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-primary px-2 py-0.75 text-[11px] font-extrabold text-primary-foreground shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffd96b] animate-pulse" />
            শীর্ষ সংবাদ
          </span>
        )}
      </div>

      <div className={`pt-2.25 ${padded ? "px-3.25" : ""}`}>
        <span className="text-xs font-extrabold text-primary">
          {subcategoryName || item.category.name}
        </span>
        <h3
          className={`m-0 mt-1 font-extrabold leading-[1.35] text-navy transition-colors duration-200 group-hover:text-primary ${
            featured
              ? `text-2xl ${layout === "split" ? "sm:text-[25px]" : "sm:text-[26px]"}`
              : "text-[17px]"
          }`}
        >
          {item.title}
        </h3>

        {featured && (
          <p className="my-2 text-sm leading-[1.6] text-muted-foreground">
            {item.summary}
          </p>
        )}

        <div className="mt-2 flex items-center gap-1.25 text-[11px] text-muted-foreground/80">
          <Clock3 size={13} />
          <span>{formatTimeAgo(item.publishedAt)}</span>
          {item.reporter && (
            <>
              <span>•</span>
              <span>{item.reporter}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
