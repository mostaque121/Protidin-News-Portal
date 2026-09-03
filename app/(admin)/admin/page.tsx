// app/admin/page.tsx
import { StatusBadge } from "@/components/admin/status-badge";
import { formatTimeAgo } from "@/lib/format-time";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  ChevronRight,
  FileText,
  FolderTree,
  Plus,
  UserCog,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function toBengaliNumerals(num: number): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

const accentBorder = {
  primary: "border-t-primary",
  teal: "border-t-teal",
  gold: "border-t-gold",
  navy: "border-t-navy",
} as const;
const quickActions = [
  {
    title: "সংবাদ ব্যবস্থাপনা",
    subtitle: "সকল সংবাদ দেখুন ও পরিচালনা করুন",
    icon: FileText,
    iconClass: "bg-primary/10 text-primary",
    href: "/admin/news",
  },
  {
    title: "ইউজার ব্যবস্থাপনা",
    subtitle: "ADMIN ও MODERATOR পরিচালনা করুন",
    icon: Users,
    iconClass: "bg-gold/20 text-navy",
    href: "/admin/users",
  },
  {
    title: "বিভাগ ব্যবস্থাপনা",
    subtitle: "বিভাগ ও উপবিভাগ পরিচালনা করুন",
    icon: FolderTree,
    iconClass: "bg-navy/10 text-navy",
    href: "/admin/categories",
  },
  {
    title: "প্রোফাইল সেটিংস",
    subtitle: "নিজের তথ্য ও পাসওয়ার্ড পরিবর্তন করুন",
    icon: UserCog,
    iconClass: "bg-teal/10 text-teal",
    href: "/admin/profile",
  },
];
export default async function AdminDashboardPage() {
  const [totalNews, publishedNews, draftNews, totalCategories, recentNews] =
    await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.category.count(),
      prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          title: true,
          id: true,
          publishedAt: true,
          status: true,
          category: { select: { name: true } },
          coverImage: true,
        },
      }),
    ]);

  const stats = [
    {
      label: "মোট সংবাদ",
      value: toBengaliNumerals(totalNews),
      hint: "প্রকাশিত ও ড্রাফট মিলিয়ে",
      accent: "primary" as const,
    },
    {
      label: "প্রকাশিত সংবাদ",
      value: toBengaliNumerals(publishedNews),
      hint: "লাইভ সংবাদের সংখ্যা",
      accent: "teal" as const,
    },
    {
      label: "খসড়া (ড্রাফট)",
      value: toBengaliNumerals(draftNews),
      hint: "অপেক্ষমাণ সংবাদ",
      accent: "gold" as const,
    },
    {
      label: "মোট বিভাগ",
      value: toBengaliNumerals(totalCategories),
      hint: "সক্রিয় বিভাগসমূহ",
      accent: "navy" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-295">
      {/* Header */}
      <div className="mb-6">
        <span className="text-xs font-extrabold text-primary">
          কনটেন্ট স্টুডিও
        </span>
        <h1 className="mt-1 text-3xl font-black text-navy sm:text-4xl">
          অ্যাডমিন ড্যাশবোর্ড
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          আজকের সংবাদ ব্যবস্থাপনা এক নজরে দেখুন।
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`border-t-4 bg-paper px-5 py-5 border-x border-b border-border/60 ${
              accentBorder[stat.accent]
            }`}
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-black text-navy">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
          </div>
        ))}
      </div>

      {/* Top Action Links */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} /> নতুন সংবাদ লিখুন
        </Link>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 border border-border bg-paper px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-muted"
        >
          <Plus size={16} /> বিভাগ যোগ করুন
        </Link>
        <Link
          href="/admin/subcategories/new"
          className="inline-flex items-center gap-2 border border-border bg-paper px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-muted"
        >
          <Plus size={16} /> উপবিভাগ যোগ করুন
        </Link>
      </div>

      {/* Main Grid: Recent Activity + Quick Add */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Recent Articles */}
        <section className="border border-border bg-paper p-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-extrabold text-primary">
              সাম্প্রতিক কাজ
            </span>
            <Link
              href="/admin/news"
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <h2 className="mb-4 text-xl font-bold text-navy">সাম্প্রতিক সংবাদ</h2>

          <div className="flex flex-col">
            {recentNews.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                কোনো সংবাদ পাওয়া যায়নি।
              </p>
            ) : (
              recentNews.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b border-border py-3 last:border-b-0"
                >
                  <div className="relative h-12 w-14 shrink-0 overflow-hidden bg-muted">
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                        ছবি নেই
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/news/${item.id}/edit`}
                      className="line-clamp-2 text-sm font-bold text-navy hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {item.category?.name || "সাধারণ"} ·{" "}
                      {formatTimeAgo(item.publishedAt)}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions Sidebar */}
        <section className="border border-border bg-paper p-5">
          <span className="text-xs font-extrabold text-primary">
            কনটেন্ট ব্যবস্থাপনা
          </span>
          <h2 className="mb-4 text-xl font-bold text-navy">দ্রুত এক্সেস</h2>

          <div className="flex flex-col gap-3">
            {quickActions.map(
              ({ title, subtitle, icon: Icon, iconClass, href }) => (
                <Link
                  key={title}
                  href={href}
                  className="flex items-center gap-3 border border-border px-4 py-3 text-left transition-colors hover:bg-muted"
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center ${iconClass}`}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-navy">
                      {title}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {subtitle}
                    </span>
                  </span>
                  <ChevronRight
                    size={16}
                    className="shrink-0 text-muted-foreground"
                  />
                </Link>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
