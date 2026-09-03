"use client";

import { CheckCircle2, Clock, Flame, Newspaper } from "lucide-react";

interface ArticleStatsCardsProps {
  stats: {
    total: number;
    published: number;
    draft: number;
    top: number;
  };
}

const accentMap = {
  navy: {
    border: "border-t-navy",
    iconBg: "bg-navy/10 text-navy",
  },
  teal: {
    border: "border-t-teal",
    iconBg: "bg-teal/10 text-teal",
  },
  gold: {
    border: "border-t-gold",
    iconBg: "bg-gold/10 text-gold",
  },
  primary: {
    border: "border-t-primary",
    iconBg: "bg-primary/10 text-primary",
  },
} as const;

export function ArticleStatsCards({ stats }: ArticleStatsCardsProps) {
  const items = [
    {
      title: "মোট সংবাদ",
      value: stats.total,
      icon: Newspaper,
      accent: "navy" as const,
    },
    {
      title: "প্রকাশিত",
      value: stats.published,
      icon: CheckCircle2,
      accent: "teal" as const,
    },
    {
      title: "খসড়া (Draft)",
      value: stats.draft,
      icon: Clock,
      accent: "gold" as const,
    },
    {
      title: "শীর্ষ নিউজ",
      value: stats.top,
      icon: Flame,
      accent: "primary" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const style = accentMap[item.accent];

        return (
          <div
            key={item.title}
            className={`border-t-4 bg-paper p-5 transition-shadow hover:shadow-sm ${style.border}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-muted-foreground">
                {item.title}
              </span>
              <div
                className={`grid size-8 shrink-0 place-items-center ${style.iconBg}`}
              >
                <Icon size={16} />
              </div>
            </div>

            <p className="mt-3  text-3xl font-black text-navy">
              {item.value.toLocaleString("bn-BD")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
