import { ProductOwnerViewModel } from './ProductOwnerViewModel';

export interface ProductWithOwnerViewModel {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  price: number;
  owner: ProductOwnerViewModel;
}
