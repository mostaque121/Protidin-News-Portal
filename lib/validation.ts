import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name is too long"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),

  sortOrder: z
    .number()
    .int("Sort order must be a whole number")
    .min(0, "Sort order cannot be negative"),

  isActive: z.boolean(),
});

export const subcategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Subcategory name is required")
    .max(100, "Subcategory name is too long"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),

  categoryId: z.string().min(1, "Category is required"),

  sortOrder: z
    .number()
    .int("Sort order must be a whole number")
    .min(1, "Sort order cannot be negative"),

  isActive: z.boolean(),
});

export type CategoryFormData = z.input<typeof categorySchema>;
export type SubcategoryFormData = z.input<typeof subcategorySchema>;

export const articleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  reporter: z.string().optional().nullable(),
  content: z.string().min(10, "Content cannot be empty"),

  coverImage: z.string().optional().nullable(),
  coverImageSource: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),

  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  isTop: z.boolean(),

  categoryId: z.string().min(1, "Please select a category"),
  subcategoryId: z.string().optional().nullable(),
});

export type ArticleFormData = z.input<typeof articleSchema>;
