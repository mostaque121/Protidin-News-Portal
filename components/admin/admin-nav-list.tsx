"use client";

import { adminNavItems } from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {adminNavItems.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 border-l-2 border-transparent px-4 py-2.5 text-sm transition-colors",
              active
                ? "border-gold bg-white/6 font-semibold text-white"
                : "text-[#b9c6c8] hover:bg-white/4 hover:text-white",
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
