"use server";

import { ArticleStatus, Prisma } from "@/generated/prisma/client";
import { requireRole } from "@/lib/admin-auth";
import { getErrorMessage } from "@/lib/get-error-message";
import { prisma } from "@/lib/prisma";
import { ArticleFormData, articleSchema } from "@/lib/validation";
import { revalidatePath, updateTag } from "next/cache";

export interface ArticleFilterParams {
  search?: string;
  status?: string;
  categoryId?: string;
  subcategoryId?: string;
  month?: string; // YYYY-MM
  page?: number;
  limit?: number;
}

export async function getAdminArticlesAction(params: ArticleFilterParams) {
  const page = Math.max(1, params.page || 1);
  const limit = params.limit || 30;
  const skip = (page - 1) * limit;

  const where: Prisma.ArticleWhereInput = {};

  // Search filter
  if (params.search?.trim()) {
    const searchTerm = params.search.trim();
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },

      { reporter: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  // Status filter
  if (
    params.status &&
    Object.values(ArticleStatus).includes(params.status as ArticleStatus)
  ) {
    where.status = params.status as ArticleStatus;
  }

  // Category filter
  if (params.categoryId) {
    where.categoryId = params.categoryId;
  }

  // Subcategory filter
  if (params.subcategoryId) {
    where.subcategoryId = params.subcategoryId;
  }

  // Month filter (YYYY-MM)
  if (params.month) {
    const [year, month] = params.month.split("-").map(Number);
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      where.publishedAt = {
        gte: startDate,
        lte: endDate,
      };
    }
  }

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        subcategory: { select: { id: true, name: true } },
        author: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    articles,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getAdminArticleStatsAction() {
  const [total, published, draft, top] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.article.count({ where: { isTop: true, status: "PUBLISHED" } }),
  ]);

  return {
    total,
    published,
    draft,
    top,
  };
}

export async function deleteArticleAction(id: string) {
  try {
    const deletedArticle = await prisma.article.delete({
      where: { id },
      include: { category: true, subcategory: true },
    });
    revalidatePath("/");
    revalidatePath(`/news/${deletedArticle.id}`);
    updateTag(`category-only-${deletedArticle.category.slug}`);
    updateTag(`subcategory-${deletedArticle.subcategory?.slug}`);
    updateTag("latest-news");
    updateTag("latest-top-news");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "সংবাদটি মুছে ফেলা সম্ভব হয়নি",
    };
  }
}

export async function upsertArticleAction(data: ArticleFormData, id?: string) {
  const user = await requireRole(["ADMIN", "MODERATOR"]);
  const validatedFields = articleSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: getErrorMessage(
        validatedFields.error,
        "একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      ),
    };
  }

  const {
    title,
    summary,
    reporter,
    content,
    coverImage,
    coverImageSource,
    videoUrl,
    status,
    isTop,
    categoryId,
    subcategoryId,
  } = validatedFields.data;

  try {
    if (id) {
      const editedArticle = await prisma.article.update({
        where: { id },
        data: {
          title,
          summary,
          reporter,
          content,
          coverImage,
          coverImageSource,
          videoUrl,
          status,
          isTop,
          categoryId,
          subcategoryId: subcategoryId || null,
        },
        include: { category: true, subcategory: true },
      });
      revalidatePath("/");
      revalidatePath(`/news/${editedArticle.id}`);
      updateTag(`category-only-${editedArticle.category.slug}`);
      updateTag(`subcategory-${editedArticle.subcategory?.slug}`);
      updateTag("latest-news");
      updateTag("latest-top-news");
    } else {
      const createdArticle = await prisma.article.create({
        data: {
          title,
          summary,
          reporter,
          content,
          coverImage,
          coverImageSource,
          videoUrl,
          status,
          isTop,
          categoryId,
          subcategoryId: subcategoryId || null,
          authorId: user.id,
        },
        include: { category: true, subcategory: true },
      });

      revalidatePath("/");
      updateTag(`category-only-${createdArticle.category.slug}`);
      updateTag(`subcategory-${createdArticle.subcategory?.slug}`);
      updateTag("latest-news");
      updateTag("latest-top-news");
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(
        error,
        "একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      ),
    };
  }
}

export type AdminArticlesResult = Awaited<
  ReturnType<typeof getAdminArticlesAction>
>;
export type AdminArticleStats = Awaited<
  ReturnType<typeof getAdminArticleStatsAction>
>;
