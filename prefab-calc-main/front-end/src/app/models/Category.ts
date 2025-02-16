import { PrefabItem } from './PrefabItem';

export interface Category {
  id: number;
  name: string;
  items: PrefabItem[];
}
