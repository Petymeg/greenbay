import { AddUserProductRequestModel } from '../models/common/AddUserProductRequestModel';
import { productRepository } from '../repositories/product.repository';

export const productService = {
  async addUserProduct(
    productDetails: AddUserProductRequestModel
  ): Promise<number> {
    return await productRepository.addUserProduct(productDetails);
  },
};
