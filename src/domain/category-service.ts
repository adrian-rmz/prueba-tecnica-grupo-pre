import type { Category, CategorySearchResult } from "./category.js";

export class CategoryService {
  getActiveLeafPaths(root: Category): string[] {
    const paths: string[] = [];

    function traverseCategories(category: Category, currentPath: string): void {
      if (!category.active) {
        return;
      }

      const nextPath = currentPath
        ? `${currentPath}/${category.name}`
        : category.name;

      if (category.subcategories.length === 0) {
        paths.push(nextPath);
        return;
      }

      for (const subcategory of category.subcategories) {
        traverseCategories(subcategory, nextPath);
      }
    }

    traverseCategories(root, "");

    return paths.sort((a, b) => a.localeCompare(b));
  }

  findCategoryById(root: Category, id: number): CategorySearchResult | null {
    function searchCategory(
      category: Category,
      currentPath: string,
      depth: number,
      parentId: number | null,
    ): CategorySearchResult | null {
      const nextPath = currentPath
        ? `${currentPath}/${category.name}`
        : category.name;

      if (category.id === id) {
        return {
          node: category,
          path: nextPath,
          depth,
          parentId,
          isLeaf: category.subcategories.length === 0,
        };
      }

      for (const subcategory of category.subcategories) {
        const result = searchCategory(
          subcategory,
          nextPath,
          depth + 1,
          category.id,
        );

        if (result !== null) {
          return result;
        }
      }

      return null;
    }

    return searchCategory(root, "", 0, null);
  }
}
