import { SubcategoryForm } from "@/components/admin/categories/subcategory-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditSubcategoryPageProps {
  params: Promise<{
    id: string;
    subcategoryId: string;
  }>;
}

export default async function EditSubcategoryPage({
  params,
}: EditSubcategoryPageProps) {
  const { id, subcategoryId } = await params;

  const subcategory = await prisma.subcategory.findUnique({
    where: { id: subcategoryId },
  });

  if (!subcategory || subcategory.categoryId !== id) {
    notFound();
  }

  return (
    <SubcategoryForm
      defaultCategoryId={id}
      initialData={{
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        categoryId: subcategory.categoryId,
        sortOrder: subcategory.sortOrder,
        isActive: subcategory.isActive,
      }}
    />
  );
}
