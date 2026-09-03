import { getLatestNews } from "@/actions/news-action";
import { LatestNews } from "@/components/news/latest-news";
import { RelatedNews } from "@/components/news/related-news";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import ReadOnlyEditor from "@/components/tiptap-templates/simple/read-only-editor";

import { formatBanglaDateTime } from "@/lib/format-time";
import { getEmbedUrl } from "@/lib/get-embedded-url";
import { prisma } from "@/lib/prisma";
import { CalendarDays, Share2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const recentArticles = await prisma.article.findMany({
    take: 20,
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
    },
  });

  return recentArticles.map((article) => ({
    id: article.id,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      summary: true,
      content: true,
      reporter: true,
      coverImage: true,
      coverImageSource: true,
      videoUrl: true,
      publishedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      subcategory: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  const latestNews = await getLatestNews();
  if (!item) notFound();

  return (
    <main className="mx-auto w-[calc(100%-28px)] py-5.5 sm:w-[min(1180px,calc(100%-48px))] sm:py-8.5 sm:pb-17.5">
      {/* Full-Width Heading Section */}
      <header className="mb-8 border-b border-border pb-6">
        <span className="mb-3 block text-xs font-extrabold text-primary">
          {item.category.name}
        </span>
        <h1 className="mb-4 max-w-4xl text-[30px] font-bold leading-tight text-navy sm:text-[44px]">
          {item.title}
        </h1>
        <p className="mb-6 max-w-3xl text-base leading-[1.65] text-[#5f6866] sm:text-lg">
          {item.summary}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <span className="flex items-center gap-1.25">
              <CalendarDays size={15} />{" "}
              {formatBanglaDateTime(item.publishedAt)}
            </span>
            <span>
              লেখা:{" "}
              <span className="font-semibold text-navy">{item.reporter}</span>
            </span>
          </div>

          <button
            aria-label="শেয়ার"
            className="grid h-7.75 w-7.75 place-items-center border border-border bg-paper text-navy transition-colors hover:bg-muted"
          >
            <Share2 size={17} />
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="grid gap-8.5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left Column - Article Body */}
        <article>
          {/* Conditional Media Rendering: Video > Cover Image > Nothing */}
          {item.videoUrl ? (
            <div className="relative mb-2 aspect-video w-full overflow-hidden bg-muted">
              <iframe
                src={getEmbedUrl(item.videoUrl) ?? undefined}
                title={item.title}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : item.coverImage ? (
            <>
              <div className="relative mb-2 aspect-video w-full max-h-132.5 overflow-hidden bg-muted">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
              </div>
              {item.coverImageSource && (
                <p className="mb-6 text-right text-[11px] text-[#8d887e]">
                  {item.coverImageSource || "ছবি: প্রতিদিন সংবাদ"}
                </p>
              )}
            </>
          ) : null}

          {/* Render HTML Content Safely */}
          <ReadOnlyEditor content={item.content} />
        </article>

        {/* Right Column - Sidebar */}
        <aside className="flex flex-col gap-8">
          <LatestNews items={latestNews} />
          <RelatedNews
            categoryId={item.category?.id || ""}
            subcategoryId={item.subcategory?.id}
            articleId={item.id}
          />
        </aside>
      </div>
    </main>
  );
}
