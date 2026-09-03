// lib/admin-user.ts
export interface AdminUser {
  name: string;
  email: string;
  image?: string | null;
  role: "ADMIN" | "MODERATOR";
}

export const ROLE_LABEL: Record<AdminUser["role"], string> = {
  ADMIN: "অ্যাডমিন",
  MODERATOR: "মডারেটর",
};

export function getInitial(name: string) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "?";
}
