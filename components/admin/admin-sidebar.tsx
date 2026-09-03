// components/admin/admin-sidebar.tsx
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { AdminUser, ROLE_LABEL, getInitial } from "@/lib/admin-user";
import { AdminNavList } from "./admin-nav-list";

export function AdminSidebar({ user }: { user: AdminUser }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-65 shrink-0 flex-col bg-navy text-white lg:flex">
      <div className="px-6 py-6">
        <Link
          href="/"
          className=" text-[26px] font-black tracking-[-.07em] text-white"
        >
          প্রতিদিন<span className="text-primary">.</span>
        </Link>
      </div>

      <div className="mx-4 mb-5 flex items-center gap-3 border-b border-white/10 pb-5">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gold text-sm font-bold text-navy">
            {getInitial(user.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{user.name}</p>
          <p className="text-xs text-[#9fb0b2]">{ROLE_LABEL[user.role]}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <AdminNavList />
      </div>

      <div className="shrink-0 border-t border-white/10 px-4 py-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-[#b9c6c8] transition-colors hover:text-white"
        >
          <ArrowLeft size={14} /> সাইটে ফিরে যান
        </Link>
      </div>
    </aside>
  );
}
