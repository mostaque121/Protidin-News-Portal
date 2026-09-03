"use client";

import { searchArticlesByTitle } from "@/actions/news-action";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCategory } from "@/contexts/category-provider";
import { authClient } from "@/lib/auth-client";
import { getBanglaDate } from "@/lib/format-time";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type LastNewsItem = {
  id: string;
  title: string;
  publishedAt: Date;
};

export function SiteHeader({ lastNews }: { lastNews: LastNewsItem | null }) {
  const { categories } = useCategory();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const [compact, setCompact] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Scroll handler for compact sticky header
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 125);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Debounce search term input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(term);
    }, 300);
    return () => clearTimeout(timer);
  }, [term]);

  // Server-side search query via TanStack Query (Minimum 4 characters)
  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: ["search-articles", debouncedTerm],
    queryFn: () => searchArticlesByTitle(debouncedTerm),
    enabled: debouncedTerm.trim().length >= 4,
    staleTime: 1000 * 60 * 2,
  });

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setTerm("");
    setDebouncedTerm("");
  };

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        handleCloseSearch();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigation removed; live dropdown handles article selection
  };

  const isLinkActive = (path: string) => pathname === path;

  return (
    <>
      {/* Top Strip */}
      <div className="w-full overflow-hidden bg-navy text-[12px] tracking-[.01em] text-[#d9e5e5]">
        <div className="mx-auto flex min-h-8 w-[calc(100%-28px)] max-w-full items-center justify-between sm:w-[min(1180px,calc(100%-48px))]">
          <span>{getBanglaDate()}</span>
          <span className="hidden sm:inline">
            <Link href="/about" className="transition-colors hover:text-white">
              আমাদের সম্পর্কে
            </Link>
            <span className="mx-2">|</span>
            <Link
              href="/contact"
              className="transition-colors hover:text-white"
            >
              যোগাযোগ
            </Link>
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="relative z-30 w-full overflow-x-clip border-b border-border bg-paper">
        <div className="mx-auto flex min-h-19.5 w-[calc(100%-28px)] max-w-full items-center justify-between sm:min-h-26.25 sm:w-[min(1180px,calc(100%-48px))]">
          {/* Mobile Sheet Trigger */}
          <div className="shrink-0 sm:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger
                render={
                  <button
                    aria-label="মেনু খুলুন"
                    className="-ml-2 p-2 text-navy hover:text-primary"
                  >
                    <Menu size={22} />
                  </button>
                }
              />
              <SheetContent
                side="left"
                className="flex w-[min(85vw,320px)] flex-col gap-0 bg-paper p-0 shadow-[14px_0_35px_#12344840]"
              >
                <SheetHeader className="border-b border-border px-6 py-5 text-left">
                  <SheetTitle
                    render={
                      <div className="flex flex-col gap-1">
                        <Link
                          href="/"
                          onClick={() => setSheetOpen(false)}
                          className="text-[28px] font-black leading-none tracking-tighter text-navy"
                        >
                          প্রতিদিন<span className="text-primary">.</span>
                        </Link>
                        <span className="text-xs font-medium text-muted-foreground">
                          {getBanglaDate()}
                        </span>
                      </div>
                    }
                  />
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-2">
                  <Link
                    href="/"
                    onClick={() => setSheetOpen(false)}
                    className={`flex items-center justify-between border-b border-border/60 py-3.5 text-[17px] font-extrabold ${
                      isLinkActive("/")
                        ? "text-primary"
                        : "text-navy hover:text-primary"
                    }`}
                  >
                    প্রচ্ছদ <ChevronRight size={16} className="opacity-60" />
                  </Link>

                  {categories.map((c) => {
                    const href = `/${c.slug}`;
                    const active = isLinkActive(href);
                    return (
                      <Link
                        key={c.id}
                        href={href}
                        onClick={() => setSheetOpen(false)}
                        className={`group flex items-center justify-between border-b border-border/60 py-3.5 text-[17px] font-bold transition-colors ${
                          active
                            ? "font-black text-primary"
                            : "text-navy hover:text-primary"
                        }`}
                      >
                        {c.name}
                        <ChevronRight
                          size={16}
                          className="text-muted-foreground/40 transition-colors group-hover:text-primary/50"
                        />
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-auto border-t border-border bg-muted/10 px-6 py-6 pb-8">
                  <div className="flex items-center gap-5 text-[14px] font-medium text-muted-foreground">
                    <Link
                      href="/video"
                      onClick={() => setSheetOpen(false)}
                      className="transition-colors hover:text-primary"
                    >
                      ভিডিও
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setSheetOpen(false)}
                      className="transition-colors hover:text-primary"
                    >
                      যোগাযোগ
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setSheetOpen(false)}
                      className="transition-colors hover:text-primary"
                    >
                      আমাদের সম্পর্কে
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="mx-auto shrink-0 text-[36px] font-black leading-none tracking-[-.07em] text-navy sm:mx-0 sm:text-[48px]"
          >
            প্রতিদিন<span className="text-primary">.</span>
          </Link>

          {/* Slogan (Desktop) */}
          <div className="ml-5.5 mr-auto hidden text-[13px] text-muted-foreground sm:block">
            সত্যের পক্ষে, মানুষের পাশে
          </div>

          {/* Search Trigger & Auth Actions */}
          <div
            ref={searchRef}
            className="static flex shrink-0 items-center gap-4.5 sm:relative"
          >
            <button
              aria-label="খুঁজুন"
              onClick={() => setSearchOpen(true)}
              className={`-mr-2 p-2 text-navy transition-opacity hover:text-primary sm:mr-0 ${
                searchOpen
                  ? "pointer-events-none invisible opacity-0"
                  : "visible opacity-100"
              }`}
            >
              <Search size={21} />
            </button>

            {/* Search Input & Overlay */}
            <div
              className={`absolute inset-x-0 top-0 z-40 flex h-full origin-right items-center bg-paper transition-all duration-300 ease-in-out sm:inset-auto sm:right-0 sm:top-1/2 sm:h-11 sm:-translate-y-1/2 ${
                searchOpen
                  ? "visible w-full opacity-100 sm:w-80"
                  : "pointer-events-none invisible w-10 opacity-0"
              }`}
            >
              <form
                onSubmit={submitSearch}
                className="flex h-full w-full items-center border-b border-border bg-paper shadow-md  sm:border sm:border-border sm:shadow-sm"
              >
                <Search
                  size={18}
                  className="ml-4 shrink-0 text-muted-foreground sm:ml-3"
                />
                <input
                  autoFocus={searchOpen}
                  aria-label="সংবাদ খুঁজুন"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="কমপক্ষে ৪টি অক্ষর লিখুন..."
                  className="h-full w-full bg-transparent px-3 text-sm text-navy outline-none"
                />
                {isFetching ? (
                  <Loader2
                    size={18}
                    className="mr-2 animate-spin text-muted-foreground"
                  />
                ) : (
                  <button
                    type="button"
                    aria-label="বন্ধ করুন"
                    onClick={handleCloseSearch}
                    className="mr-2 p-2 text-muted-foreground hover:text-navy sm:mr-1"
                  >
                    <X size={20} />
                  </button>
                )}
              </form>

              {/* Live Search Results Container */}
              {searchOpen && debouncedTerm.trim().length >= 4 && (
                <div className="absolute left-0 right-0 top-full z-50 max-h-[70vh] w-full overflow-y-auto border-b border-border bg-paper shadow-xl sm:left-auto sm:right-0 sm:mt-2 sm:rounded-none sm:border sm:border-border">
                  {searchResults.length > 0 ? (
                    <div className="flex flex-col">
                      <span className="border-b border-border/40 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
                        ফলাফল ({searchResults.length})
                      </span>
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          href={`/news/${item.id}`}
                          onClick={handleCloseSearch}
                          className="flex items-start gap-2.5 border-b border-border/20 px-4 py-3 text-[13px] font-semibold leading-relaxed text-navy transition-colors last:border-b-0 hover:bg-muted/60 hover:text-primary"
                        >
                          <ChevronRight
                            size={16}
                            className="mt-0.5 shrink-0 text-primary"
                          />
                          <span className="line-clamp-2">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    !isFetching && (
                      <div className="px-4 py-6 text-center text-[13px] text-muted-foreground">
                        কোনো ফলাফল পাওয়া যায়নি
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Auth Session Button */}
            <Link
              href={session ? "/admin" : "/login"}
              className="hidden  border border-navy px-5 py-1.5 text-[13px] font-semibold text-navy transition-colors hover:bg-navy hover:text-white sm:block"
            >
              {session ? "ড্যাশবোর্ড" : "লগইন"}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Desktop Navbar */}
      <nav className="hidden w-full overflow-hidden border-b border-border bg-paper sm:block">
        <div className="mx-auto flex w-[min(1180px,calc(100%-48px))] max-w-full overflow-x-auto">
          <Link
            href="/"
            className={`whitespace-nowrap border-l-4 border-r border-border px-5.25 py-3 text-sm font-bold transition-colors ${
              isLinkActive("/")
                ? "bg-primary/5 border-l-primary text-primary"
                : "border-l-transparent text-navy hover:bg-[#f3e5dc] hover:text-primary"
            }`}
          >
            প্রচ্ছদ
          </Link>
          {categories.map((c) => {
            const href = `/${c.slug}`;
            const active = isLinkActive(href);
            return (
              <Link
                key={c.id}
                href={href}
                className={`whitespace-nowrap border-r border-border px-5.25 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-primary/10 font-bold text-primary"
                    : "text-navy hover:bg-[#f3e5dc] hover:text-primary"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Sticky Nav */}
      <nav
        aria-label="দ্রুত বিভাগ"
        className={`fixed inset-x-0 top-0 z-50 w-full overflow-hidden bg-navy text-white shadow-[0_5px_18px_#1234482b] transition-all duration-300 ${
          compact
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible translate-y-[-110%] opacity-0"
        }`}
      >
        <div className="mx-auto flex min-h-13.75 w-[calc(100%-28px)] max-w-full items-center justify-between sm:w-[min(1180px,calc(100%-48px))]">
          {/* Mobile Sticky Bar Layout */}
          <div className="flex w-full items-center justify-between sm:hidden">
            <button
              aria-label="মেনু খুলুন"
              onClick={() => setSheetOpen(true)}
              className="p-1 text-white hover:text-gold"
            >
              <Menu size={20} />
            </button>
            <Link
              href="/"
              className="text-xl font-black tracking-tight text-white"
            >
              প্রতিদিন<span className="text-primary">.</span>
            </Link>
            <button
              aria-label="খুঁজুন"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setSearchOpen(true);
              }}
              className="p-1 text-white hover:text-gold"
            >
              <Search size={19} />
            </button>
          </div>

          {/* Desktop Sticky Bar Layout */}
          <div className="hidden w-full items-center justify-between gap-4 sm:flex">
            <Link
              href="/"
              className="shrink-0 text-2xl font-black tracking-tight text-white"
            >
              প্রতিদিন<span className="text-primary">.</span>
            </Link>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto">
              <Link
                href="/"
                className={`whitespace-nowrap px-3 py-2 text-sm font-semibold transition-colors ${
                  isLinkActive("/")
                    ? "font-bold text-gold"
                    : "text-[#e6eeee] hover:bg-white/10 hover:text-white"
                }`}
              >
                প্রচ্ছদ
              </Link>
              {categories.map((c) => {
                const href = `/${c.slug}`;
                const active = isLinkActive(href);
                return (
                  <Link
                    key={c.id}
                    href={href}
                    className={`whitespace-nowrap px-3 py-2 text-sm transition-colors ${
                      active
                        ? "font-bold text-gold"
                        : "text-[#e6eeee] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Breaking News Bar */}
      {lastNews && (
        <div className="w-full overflow-hidden bg-primary text-primary-foreground">
          <div className="mx-auto flex min-h-9.5 w-[calc(100%-28px)] max-w-full items-center gap-2.5 sm:min-h-10.5 sm:w-[min(1180px,calc(100%-48px))] sm:gap-5">
            <span className="flex items-center gap-2.25 whitespace-nowrap text-[13px] font-extrabold">
              <span className="relative inline-block h-2 w-2 rounded-full bg-[#ffd96b] shadow-[0_0_0_4px_#fff3b833]" />
              সর্বশেষ
            </span>
            <Link
              href={`/news/${lastNews.id}`}
              className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] hover:underline"
            >
              <span className="truncate">{lastNews.title}</span>
              <ChevronRight size={16} className="shrink-0" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
