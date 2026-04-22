import {
  CategoryErrorCode,
  type Category,
  type CategorySearchResult,
  type StructureAnalysisReport,
} from "./category.js";

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

  // Time: O(n), where n is the number of reachable nodes.
  // Space: O(n), for tracked IDs, anomalies, paths, and recursion stack.
  analyzeCategoryStructure(root: unknown): StructureAnalysisReport {
    const report: StructureAnalysisReport = {
      activeLeafPaths: [],
      totalValidNodes: 0,
      activeNodes: 0,
      inactiveNodes: 0,
      maxDepth: 0,
      anomalies: [],
    };

    const ids = new Set<number>();

    function traverseCategories(
      node: unknown,
      path: string,
      depth: number,
      parents: object[],
      parentIsActive: boolean,
    ): void {
      if (node === null || node === undefined) {
        report.anomalies.push({
          code: CategoryErrorCode.NullChild,
          path,
          detail: "Node is null or undefined",
        });
        return;
      }

      if (typeof node !== "object") {
        report.anomalies.push({
          code: CategoryErrorCode.InvalidNode,
          path,
          detail: "Node must be an object",
        });
        return;
      }

      if (parents.includes(node)) {
        report.anomalies.push({
          code: CategoryErrorCode.CycleDetected,
          id: (node as Record<string, unknown>).id,
          path,
          detail: "Cycle detected",
        });
        return;
      }

      const category = node as Record<string, unknown>;
      const { id, name, active, subcategories } = category;

      let currentPath = path;

      if (typeof name === "string" && name.trim() !== "") {
        const cleanName = name.trim();
        currentPath = path === "" ? cleanName : `${path}/${cleanName}`;
      }

      if (typeof id !== "number" || !Number.isFinite(id)) {
        report.anomalies.push({
          code: CategoryErrorCode.InvalidId,
          id,
          path: currentPath,
          detail: "Invalid category id",
        });
        return;
      } else if (ids.has(id)) {
        report.anomalies.push({
          code: CategoryErrorCode.DuplicateId,
          id,
          path: currentPath,
          detail: "Duplicated category id",
        });
        return;
      }

      if (typeof name !== "string" || name.trim() === "") {
        report.anomalies.push({
          code: CategoryErrorCode.InvalidName,
          id,
          path: currentPath,
          detail: "Invalid category name",
        });
        return;
      }

      if (typeof active !== "boolean") {
        report.anomalies.push({
          code: CategoryErrorCode.InvalidNode,
          id,
          path: currentPath,
          detail: "Invalid active value",
        });
        return;
      }

      if (!Array.isArray(subcategories)) {
        report.anomalies.push({
          code: CategoryErrorCode.InvalidSubcategories,
          id,
          path: currentPath,
          detail: "Invalid subcategories",
        });
        return;
      }

      ids.add(id);

      report.totalValidNodes += 1;
      report.maxDepth = Math.max(report.maxDepth, depth);

      if (active) {
        report.activeNodes += 1;
      } else {
        report.inactiveNodes += 1;
      }

      const branchIsActive = parentIsActive && active;

      if (subcategories.length === 0) {
        if (branchIsActive) {
          report.activeLeafPaths.push(currentPath);
        }

        return;
      }

      for (const child of subcategories) {
        traverseCategories(
          child,
          currentPath,
          depth + 1,
          [...parents, node],
          branchIsActive,
        );
      }
    }

    traverseCategories(root, "", 0, [], true);
    report.activeLeafPaths.sort((a, b) => a.localeCompare(b));
    return report;
  }
}
