"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getCategoriesWithSubcategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        subcategories: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });
  },
  ["categories-with-subcategories"], // Unique cache key
  {
    tags: ["categories"], // Tag used to invalidate cache on demand
  },
);
