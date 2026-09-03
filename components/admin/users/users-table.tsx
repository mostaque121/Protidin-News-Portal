// components/admin/users/users-table.tsx
"use client";

import { Plus, Search } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AddUserDialog } from "./add-user-dialog";

type Role = "ADMIN" | "MODERATOR";

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
}

interface UsersTableProps {
  users: UserListItem[];
  canManage: boolean;
}

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "অ্যাডমিন",
  MODERATOR: "মডারেটর",
};

const ROLE_BADGE_CLASS: Record<Role, string> = {
  ADMIN: "border-navy/20 bg-navy/10 text-navy",
  MODERATOR: "border-amber-500/20 bg-amber-500/10 text-amber-700",
};

function UserAvatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        className="size-8 shrink-0 border border-border object-cover rounded-none"
      />
    );
  }
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";
  return (
    <div className="grid size-8 shrink-0 place-items-center bg-navy text-xs font-bold text-white rounded-none">
      {initial}
    </div>
  );
}

export function UsersTable({ users, canManage }: UsersTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | Role>("ALL");
  const [addOpen, setAddOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  const toBanglaNumber = (num: number): string => {
    return num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d, 10)]);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className=" text-2xl sm:text-3xl font-black text-navy">
            ব্যবহারকারী
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            মোট{" "}
            <span className="font-bold text-navy">
              {toBanglaNumber(users.length)}
            </span>{" "}
            জন ব্যবহারকারী
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex items-center justify-center gap-2 bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
            ব্যবহারকারী যোগ করুন
          </button>
        )}
      </div>

      {/* Filters section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
            className=" bg-paper  pl-9 text-xs"
          />
        </div>

        <NativeSelect
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "ALL" | Role)}
          className=" bg-paper w-full sm:w-40 text-xs"
        >
          <NativeSelectOption value="ALL">সব রোল</NativeSelectOption>
          <NativeSelectOption value="ADMIN">অ্যাডমিন</NativeSelectOption>
          <NativeSelectOption value="MODERATOR">মডারেটর</NativeSelectOption>
        </NativeSelect>
      </div>

      {/* Table section */}
      <div className="border border-border bg-paper rounded-none overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-b border-border bg-muted/50">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-navy">
                ব্যবহারকারী
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-navy">
                ইমেইল
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-navy">
                রোল
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-12 text-center text-xs font-medium text-muted-foreground"
                >
                  কোনো ব্যবহারকারী পাওয়া যায়নি
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className={cn(
                    "border-b border-border transition-colors hover:bg-black/2  rounded-none",
                    canManage && "cursor-pointer",
                  )}
                  onClick={() => {
                    if (canManage) {
                      router.push(`/admin/users/${user.id}`);
                    }
                  }}
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={user.name} image={user.image} />
                      <span className=" text-sm font-bold text-navy">
                        {user.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 font-mono text-xs text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={cn(
                        "inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none",
                        ROLE_BADGE_CLASS[user.role],
                      )}
                    >
                      {ROLE_LABEL[user.role]}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {canManage && <AddUserDialog open={addOpen} onOpenChange={setAddOpen} />}
    </div>
  );
}
