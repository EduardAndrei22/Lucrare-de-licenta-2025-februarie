export interface Order {
  id?: number;
  user_id?: number;
  user_name?: string;
  items?: any[];
  total?: number;
  status?: string; // în stoc, stoc insuficient, finalizată
  address?: string;
  date_added?: string;
  date_updated?: string;
  discount?: number;
  date_due?: string;
  subtotal?: number;
  shipping?: number;
  client_id?: number;
}
