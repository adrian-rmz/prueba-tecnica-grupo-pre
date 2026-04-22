import { describe, expect, it } from "vitest";
import type { Category } from "../src/domain/category.js";
import { CategoryService } from "../src/domain/category-service.js";

function createExampleTree(): Category {
  return {
    id: 1,
    name: "Electronic",
    active: true,
    subcategories: [
      {
        id: 2,
        name: "Computers",
        active: true,
        subcategories: [
          { id: 6, name: "Laptops", active: true, subcategories: [] },
          { id: 7, name: "Desktops", active: false, subcategories: [] },
        ],
      },
      { id: 3, name: "Phones", active: true, subcategories: [] },
      { id: 4, name: "Accesories", active: true, subcategories: [] },
      {
        id: 5,
        name: "Inactive",
        active: false,
        subcategories: [
          { id: 8, name: "Hidden", active: true, subcategories: [] },
        ],
      },
    ],
  };
}

describe("CategoryService", () => {
  it("returns active leaf paths sorted alphabetically", () => {
    const service = new CategoryService();
    const tree = createExampleTree();

    const result = service.getActiveLeafPaths(tree);

    expect(result).toEqual([
      "Electronic/Accesories",
      "Electronic/Computers/Laptops",
      "Electronic/Phones",
    ]);
  });

  it("does not include inactive branches", () => {
    const service = new CategoryService();
    const tree = createExampleTree();

    const result = service.getActiveLeafPaths(tree);

    expect(result).not.toContain("Electronic/Inactive/Hidden");
    expect(result).not.toContain("Electronic/Computers/Desktops");
  });

  it("finds a category by id", () => {
    const service = new CategoryService();
    const tree = createExampleTree();

    const result = service.findCategoryById(tree, 6);

    expect(result).toEqual({
      node: { id: 6, name: "Laptops", active: true, subcategories: [] },
      path: "Electronic/Computers/Laptops",
      depth: 2,
      parentId: 2,
      isLeaf: true,
    });
  });

  it("returns null when category id does not exist", () => {
    const service = new CategoryService();
    const tree = createExampleTree();

    const result = service.findCategoryById(tree, 999);

    expect(result).toBeNull();
  });

  it("finds the root category", () => {
    const service = new CategoryService();
    const tree = createExampleTree();

    const result = service.findCategoryById(tree, 1);

    expect(result).toEqual({
      node: tree,
      path: "Electronic",
      depth: 0,
      parentId: null,
      isLeaf: false,
    });
  });
});
