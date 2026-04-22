import type { Category } from "./category.js";

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
}
