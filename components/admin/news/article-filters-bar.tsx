"use client";

import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useCategory } from "@/contexts/category-provider";
import { ArticleStatus } from "@/generated/prisma/enums";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export interface ArticleFilters {
  search?: string;
  status?: string;
  categoryId?: string;
  subcategoryId?: string;
  month?: string;
}

function getMonthOptions(monthsToGenerate = 12) {
  const options = [];
  const now = new Date();

  for (let i = 0; i < monthsToGenerate; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthIndex = d.getMonth();
    const year = d.getFullYear();

    const value = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("bn-BD", {
      month: "long",
      year: "numeric",
    });

    options.push({ label, value });
  }

  return options;
}

export function ArticleFiltersBar({
  filters,
  onChange,
}: {
  filters: ArticleFilters;
  onChange: (updates: Record<string, string | undefined | null>) => void;
}) {
  const { categories } = useCategory();
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [prevSearchFilter, setPrevSearchFilter] = useState(
    filters.search || "",
  );

  const monthOptions = useMemo(() => getMonthOptions(12), []);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === filters.categoryId),
    [categories, filters.categoryId],
  );

  const subcategoryOptions = useMemo(
    () => activeCategory?.subcategories || [],
    [activeCategory],
  );

  if (filters.search !== prevSearchFilter) {
    setPrevSearchFilter(filters.search || "");
    setSearchInput(filters.search || "");
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.search || "")) {
        onChange({ search: searchInput || undefined });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onChange]);

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.status ||
    filters.categoryId ||
    filters.subcategoryId ||
    filters.month,
  );

  return (
    <div className="border border-border bg-paper p-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="সংবাদ শিরোনাম, সারসংক্ষেপ বা রিপোর্টার..."
            className=" pl-9 pr-8"
          />

          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Category */}
        <div className="w-full">
          <NativeSelect
            className="w-full"
            value={filters.categoryId || "all"}
            onChange={(e) => {
              const val = e.target.value === "all" ? undefined : e.target.value;

              onChange({
                categoryId: val,
                subcategoryId: undefined,
              });
            }}
          >
            <NativeSelectOption value="all">সকল ক্যাটাগরি</NativeSelectOption>

            {categories.map((cat) => (
              <NativeSelectOption key={cat.id} value={cat.id}>
                {cat.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        {/* Subcategory */}
        <div className="w-full">
          <NativeSelect
            className="w-full"
            value={filters.subcategoryId || "all"}
            disabled={!filters.categoryId || subcategoryOptions.length === 0}
            onChange={(e) => {
              const val = e.target.value === "all" ? undefined : e.target.value;

              onChange({ subcategoryId: val });
            }}
          >
            <NativeSelectOption value="all">
              সকল সাবক্যাটাগরি
            </NativeSelectOption>

            {subcategoryOptions.map((sub) => (
              <NativeSelectOption key={sub.id} value={sub.id}>
                {sub.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        {/* Status */}
        <div className="w-full">
          <NativeSelect
            className="w-full"
            value={filters.status || "all"}
            onChange={(e) => {
              const val = e.target.value === "all" ? undefined : e.target.value;

              onChange({ status: val });
            }}
          >
            <NativeSelectOption value="all">সকল স্ট্যাটাস</NativeSelectOption>

            <NativeSelectOption value={ArticleStatus.PUBLISHED}>
              প্রকাশিত
            </NativeSelectOption>

            <NativeSelectOption value={ArticleStatus.DRAFT}>
              খসড়া (Draft)
            </NativeSelectOption>

            <NativeSelectOption value={ArticleStatus.ARCHIVED}>
              আর্কাইভড
            </NativeSelectOption>
          </NativeSelect>
        </div>

        {/* Month */}
        <div className="w-full">
          <NativeSelect
            className="w-full"
            value={filters.month || "all"}
            onChange={(e) => {
              const val = e.target.value === "all" ? undefined : e.target.value;

              onChange({ month: val });
            }}
          >
            <NativeSelectOption value="all">সকল সময়</NativeSelectOption>

            {monthOptions.map((m) => (
              <NativeSelectOption key={m.value} value={m.value}>
                {m.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>
      {/* Clear Filters Reset Button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={() =>
              onChange({
                search: undefined,
                status: undefined,
                categoryId: undefined,
                subcategoryId: undefined,
                month: undefined,
              })
            }
            className="inline-flex items-center text-xs text-primary hover:underline font-extrabold gap-1 cursor-pointer"
          >
            <X className="size-3" /> ফিল্টার রিসেট করুন
          </button>
        </div>
      )}
    </div>
  );
}
