import {
  FolderTree,
  LayoutDashboard,
  Newspaper,
  SavePlus,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";
import { news } from "./data";

export const adminUser = {
  name: "আহমেদ রায়হান",
  role: "সুপার অ্যাডমিন",
  initial: "আই",
};

export type AdminNavItem = { label: string; href: string; icon: LucideIcon };

export const adminNavItems: AdminNavItem[] = [
  { label: "ড্যাশবোর্ড", href: "/admin", icon: LayoutDashboard },
  { label: "নতুন সংবাদ", href: "/admin/news/new", icon: SavePlus },
  { label: "সংবাদসমূহ", href: "/admin/news", icon: Newspaper },
  { label: "বিভাগ ও উপবিভাগ", href: "/admin/categories", icon: FolderTree },
  { label: "ব্যবহারকারীগণ", href: "/admin/users", icon: Users },
  { label: "প্রোফাইল", href: "/admin/profile", icon: UserCircle },
];
export type DashboardStat = {
  label: string;
  value: string;
  hint: string;
  accent: "primary" | "teal" | "gold" | "navy";
};

export const dashboardStats: DashboardStat[] = [
  { label: "মোট সংবাদ", value: "১২৮", hint: "এই মাসে +১২%", accent: "primary" },
  { label: "প্রকাশিত", value: "৯৪", hint: "সক্রিয় সংবাদ", accent: "teal" },
  {
    label: "খসড়া",
    value: "২৮",
    hint: "পর্যালোচনার অপেক্ষায়",
    accent: "gold",
  },
  { label: "ভিডিও সংবাদ", value: "৬", hint: "১টি এই সপ্তাহে", accent: "navy" },
];

export type ContentStatus = "published" | "draft";

export type AdminActivityItem = {
  id: number;
  title: string;
  category: string;
  time: string;
  image: string;
  status: ContentStatus;
};

/** Reuses the same news list so the dashboard never drifts from the real data. */
export const recentActivity: AdminActivityItem[] = news
  .slice(0, 5)
  .map((item, i) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    time: item.time,
    image: item.image,
    status: i === 1 ? "draft" : "published",
  }));
