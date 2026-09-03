import "server-only";

import { Role } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface RequireRoleOptions {
  redirectTo?: string; // Fallback path if unauthorized (default: "/")
  loginPath?: string; // Path if unauthenticated (default: "/login")
}

/**
 * Ensures the requesting user is authenticated and possesses one of the allowed roles.
 */
export async function requireRole(
  allowedRoles: Role[],
  options: RequireRoleOptions = {},
) {
  const session = await auth.api.getSession({ headers: await headers() });

  // 1. Unauthenticated check
  if (!session?.user) {
    redirect(options.loginPath ?? "/login");
  }

  // 2. Role permission check
  const userRole = session.user.role as Role;
  if (!allowedRoles.includes(userRole)) {
    redirect(options.redirectTo ?? "/");
  }

  return session.user;
}

// ---------------------------------------------------------------------------
// Preset Wrappers
// ---------------------------------------------------------------------------

export async function requireAdmin() {
  return requireRole(["ADMIN"]);
}

export async function requireAccess() {
  return requireRole(["ADMIN", "MODERATOR"]);
}
