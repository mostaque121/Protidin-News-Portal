import { prisma } from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

// ADMIN: Full access to everything
const adminRole = ac.newRole({
  project: ["create", "update", "delete", "share"],
  ...adminAc.statements,
});

// MODERATOR: View-only access to user list
const moderatorRole = ac.newRole({
  // Only has "list" permission on "user" resource
  user: ["list"],
});

export const auth = betterAuth({
  trustedOrigins: async () => {
    return [process.env.BETTER_AUTH_URL!];
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "MODERATOR"],
        required: true,
        defaultValue: "MODERATOR",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    allowSignUp: false, // Disable self-registration
    requireEmailVerification: false,
    autoSignIn: false,
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    admin({
      ac,
      roles: {
        ADMIN: adminRole,
        MODERATOR: moderatorRole,
      },
      defaultRole: "MODERATOR",
    }),
    nextCookies(),
  ],
});
