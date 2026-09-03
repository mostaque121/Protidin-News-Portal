"use server";

import { Prisma } from "@/generated/prisma/client";
import { getErrorMessage } from "@/lib/get-error-message";
import { prisma } from "@/lib/prisma";
import {
  CategoryFormData,
  categorySchema,
  SubcategoryFormData,
  subcategorySchema,
} from "@/lib/validation";
import { revalidatePath, updateTag } from "next/cache";

export async function deleteCategoryAction(id: string) {
  try {
    const [subcategoryCount, articleCount] = await Promise.all([
      prisma.subcategory.count({
        where: { categoryId: id },
      }),
      prisma.article.count({
        where: { categoryId: id },
      }),
    ]);

    if (subcategoryCount > 0 && articleCount > 0) {
      return {
        success: false,
        error:
          "এই ক্যাটাগরিটি মুছে ফেলা সম্ভব নয়, কারণ এর অধীনে সাবক্যাটাগরি ও সংবাদ রয়েছে।",
      };
    }

    if (subcategoryCount > 0) {
      return {
        success: false,
        error:
          "এই ক্যাটাগরিটি মুছে ফেলা সম্ভব নয়, কারণ এর অধীনে সাবক্যাটাগরি রয়েছে।",
      };
    }

    if (articleCount > 0) {
      return {
        success: false,
        error:
          "এই ক্যাটাগরিটি মুছে ফেলা সম্ভব নয়, কারণ এর সাথে সংবাদ যুক্ত রয়েছে।",
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    updateTag("categories");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);

    return {
      success: false,
      error: "ক্যাটাগরিটি মুছে ফেলা সম্ভব হয়নি",
    };
  }
}

export async function upsertCategoryAction(
  data: CategoryFormData,
  id?: string,
) {
  const validatedFields = categorySchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: getErrorMessage(
        validatedFields.error,
        "একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      ),
    };
  }

  const { name, slug, sortOrder, isActive } = validatedFields.data;

  try {
    if (id) {
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          name,
          slug,
          sortOrder,
          isActive,
        },
      });

      updateTag(`category-${updatedCategory.slug}`);
    } else {
      await prisma.category.create({
        data: {
          name,
          slug,
          sortOrder,
          isActive,
        },
      });
    }

    revalidatePath("/");
    updateTag("categories");

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

export async function upsertSubcategoryAction(
  data: SubcategoryFormData,
  id?: string,
) {
  const validatedFields = subcategorySchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: getErrorMessage(
        validatedFields.error,
        "একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      ),
    };
  }

  const { name, slug, categoryId, sortOrder, isActive } = validatedFields.data;

  try {
    if (id) {
      const updatedSubcategory = await prisma.subcategory.update({
        where: { id },
        data: { name, slug, categoryId, sortOrder, isActive },
        include: { category: true },
      });
      updateTag(`category-${updatedSubcategory.category.slug}`);
    } else {
      const createdSubcategory = await prisma.subcategory.create({
        data: { name, slug, categoryId, sortOrder, isActive },
        include: { category: true },
      });
      updateTag(`category-${createdSubcategory.category.slug}`);
    }
    revalidatePath("/");
    updateTag("categories");

    return { success: true, categoryId };
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

export async function deleteSubcategoryAction(id: string) {
  try {
    await prisma.subcategory.delete({
      where: { id },
    });

    updateTag("categories");

    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          success: false,
          error:
            "এই সাবক্যাটাগরিটি মুছে ফেলা সম্ভব নয়, কারণ এর সাথে সংবাদ যুক্ত রয়েছে।",
        };
      }
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "সাবক্যাটাগরি মুছে ফেলা সম্ভব হয়নি",
    };
  }
}
