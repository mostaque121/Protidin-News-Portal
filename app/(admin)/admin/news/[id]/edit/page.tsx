import { ArticleForm } from "@/components/admin/news/news-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      summary: true,
      reporter: true,
      content: true,
      coverImage: true,
      coverImageSource: true,
      videoUrl: true,
      status: true,
      isTop: true,
      categoryId: true,
      subcategoryId: true,
    },
  });

  if (!article) {
    notFound();
  }

  return <ArticleForm initialData={article} />;
}
