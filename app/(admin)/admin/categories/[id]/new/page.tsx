import { SubcategoryForm } from "@/components/admin/categories/subcategory-form";

interface CreateSubcategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CreateSubcategoryPage({
  params,
}: CreateSubcategoryPageProps) {
  const { id } = await params;

  return <SubcategoryForm defaultCategoryId={id} />;
}
