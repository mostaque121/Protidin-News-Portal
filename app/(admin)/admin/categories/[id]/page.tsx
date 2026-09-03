import { deleteSubcategoryAction } from "@/actions/category-actions";
import { SubcategoriesClient } from "@/components/admin/categories/subcategories-client";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface SubcategoriesPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubcategoriesPage({
  params,
}: SubcategoriesPageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id: id },
    include: {
      subcategories: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <main>
      <SubcategoriesClient
        category={category}
        subcategories={category.subcategories}
        deleteSubcategoryAction={deleteSubcategoryAction}
      />
    </main>
  );
}
