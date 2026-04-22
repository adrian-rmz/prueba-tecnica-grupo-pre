export interface Category {
  id: number;
  name: string;
  active: boolean;
  subcategories: Category[];
}

export interface CategorySearchResult {
  node: Category;
  path: string;
  depth: number;
  parentId: number | null;
  isLeaf: boolean;
}

export enum CategoryErrorCode {
  InvalidNode = "INVALID_NODE",
  InvalidId = "INVALID_ID",
  DuplicateId = "DUPLICATE_ID",
  InvalidName = "INVALID_NAME",
  InvalidSubcategories = "INVALID_SUBCATEGORIES",
  NullChild = "NULL_CHILD",
  CycleDetected = "CYCLE_DETECTED",
}

export interface CategoryError {
  code: CategoryErrorCode;
  id?: unknown;
  path?: string;
  detail: string;
}

export interface StructureAnalysisReport {
  activeLeafPaths: string[];
  totalValidNodes: number;
  activeNodes: number;
  inactiveNodes: number;
  maxDepth: number;
  anomalies: CategoryError[];
}
