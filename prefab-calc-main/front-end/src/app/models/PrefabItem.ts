export interface PrefabItem {
  id: number;
  name?: string;
  description?: string;
  thumbnail?: string;
  internalname?: string;
  instock?: number;
  stock?: number;
  price?: number;
  cost?: number;
  category?: object;
  product_code?: string;
  dimensions?: any;
  edit_history?: any;
  quantity?: number;
}
