export interface Category {
  id: number;
  name: string;
  active: boolean;
  subcategories: Category[];
}
