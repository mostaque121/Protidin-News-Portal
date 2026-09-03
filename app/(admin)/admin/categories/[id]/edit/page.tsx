import { CategoryForm } from "@/components/admin/categories/category-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  return <CategoryForm initialData={category} />;
}
