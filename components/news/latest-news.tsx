import { formatTimeAgo } from "@/lib/format-time";
import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "../section-heading";

type latestNewsItem = {
  id: string;
  title: string;
  publishedAt: Date;
};

export function LatestNews({ items }: { items: latestNewsItem[] }) {
  const list = items.slice(0, 6);

  return (
    <aside className="self-start bg-navy px-4.5 pb-3.5 pt-4.5 text-[#f9f3e9]">
      <SectionHeading title="সর্বশেষ সংবাদ" dark />
      <div className="flex flex-col">
        {list.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className="flex gap-3 border-b border-white/[0.14] py-3 last:border-b-0"
          >
            <span>
              <strong className="block  text-[13px] font-bold leading-[1.4]">
                {item.title}
              </strong>
              <small className="mt-1 flex items-center gap-1 text-[10px] text-[#b8c4c5]">
                <Clock3 size={12} />
                {formatTimeAgo(item.publishedAt)}
              </small>
            </span>
          </Link>
        ))}
      </div>
      <button className="mt-3.5 flex items-center gap-1.25 border border-white/30 px-3 py-2 text-xs">
        সবশেষ সংবাদ দেখুন <ArrowRight size={15} />
      </button>
    </aside>
  );
}
