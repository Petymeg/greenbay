import { AddUserProductRequestModel } from '../models/common/AddUserProductRequestModel';
import { productRepository } from '../repositories/product.repository';
import { userService } from './userService';

export const productService = {
  async addUserProduct(
    productDetails: AddUserProductRequestModel
  ): Promise<number> {
    await userService.getUserById(productDetails.userId);

    return await productRepository.addUserProduct(productDetails);
  },
};
