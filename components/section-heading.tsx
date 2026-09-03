import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function SectionHeading({
  title,
  href,
  dark = false,
}: {
  title: string;
  href?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${
        dark ? "border-b border-white/20 pb-3" : "mb-4.5"
      }`}
    >
      <h2
        className={`m-0  text-[20px] sm:text-2xl ${
          dark ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      <span className={`h-px flex-1 ${dark ? "bg-white/20" : "bg-border"}`} />
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-bold text-primary"
        >
          সব দেখুন <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
