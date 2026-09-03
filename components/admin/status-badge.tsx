import { ArticleStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

const styles: Record<ArticleStatus, string> = {
  PUBLISHED: "bg-teal/15 text-teal",
  DRAFT: "bg-gold/20 text-[#8a6416]",
  ARCHIVED: "bg-navy/10 text-navy",
};

const labels: Record<ArticleStatus, string> = {
  PUBLISHED: "প্রকাশিত",
  DRAFT: "খসড়া",
  ARCHIVED: "আর্কাইভড",
};

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}
