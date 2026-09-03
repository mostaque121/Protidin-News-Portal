export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

import { deleteCategoryAction } from "@/actions/category-actions";
import { CategoriesClient } from "@/components/admin/categories/categories-client";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      subcategories: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <main>
      <CategoriesClient
        categories={categories}
        deleteCategoryAction={deleteCategoryAction}
      />
    </main>
  );
}
