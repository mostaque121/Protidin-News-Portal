"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  subcategories: Subcategory[];
}

export interface CategoryContextType {
  categories: Category[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined,
);

interface CategoryProviderProps {
  children: ReactNode;
  initialCategories: Category[];
}

export function CategoryProvider({
  children,
  initialCategories,
}: CategoryProviderProps) {
  return (
    <CategoryContext.Provider
      value={{
        categories: initialCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }

  return context;
}
