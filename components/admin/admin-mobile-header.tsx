// components/admin/admin-mobile-header.tsx
"use client";

import { ArrowLeft, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminUser, ROLE_LABEL, getInitial } from "@/lib/admin-user";
import { AdminNavList } from "./admin-nav-list";

export function AdminMobileHeader({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex min-h-15 items-center justify-between border-b border-border bg-paper px-4 lg:hidden">
      <Link
        href="/"
        className=" text-2xl font-black tracking-[-.07em] text-navy"
      >
        প্রতিদিন<span className="text-primary">.</span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger aria-label="মেনু খুলুন" className="p-2 text-navy">
          <Menu size={22} />
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col bg-navy text-white">
          <SheetHeader className="border-primary">
            <SheetTitle className="sr-only">অ্যাডমিন মেনু</SheetTitle>
          </SheetHeader>

          <div className="flex items-center gap-3 border-b border-white/10 px-4.5 pb-5">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-sm font-bold text-navy">
                {getInitial(user.name)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {user.name}
              </p>
              <p className="text-xs text-[#9fb0b2]">{ROLE_LABEL[user.role]}</p>
            </div>
          </div>

          <div className="flex-1 px-2 pt-2">
            <AdminNavList onNavigate={() => setOpen(false)} />
          </div>
          <div className="border-t border-white/10 px-4 py-5">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-xs text-[#b9c6c8] transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> সাইটে ফিরে যান
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
