import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

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

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      ac,
      roles: {
        ADMIN: adminRole,
        MODERATOR: moderatorRole,
      },
    }),
  ],
});
