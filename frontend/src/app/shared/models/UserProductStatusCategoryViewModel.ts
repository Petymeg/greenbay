import { ProductStatusTypes } from './enums/ProductStatusTypes';
import { UserProductViewModel } from './UserProductViewModel';

export interface UserProductStatusCategoryViewModel {
  statusCode: ProductStatusTypes;
  products: UserProductViewModel[];
}
