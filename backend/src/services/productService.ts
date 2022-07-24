import { AddUserProductRequestModel } from '../models/common/AddUserProductRequestModel';
import { productRepository } from '../repositories/product.repository';
import { notFoundError, unauthorizedError } from './generalErrorService';
import { userService } from './userService';

export const productService = {
  async addUserProduct(
    productDetails: AddUserProductRequestModel
  ): Promise<number> {
    await userService.getUserById(productDetails.userId);

    return await productRepository.addUserProduct(productDetails);
  },

  async deleteProduct(productId: number, userId: number): Promise<void> {
    const productDetails = await productRepository.getProductById(productId);

    if (!productDetails) throw notFoundError('Product with this ID not found');

    if (userId !== productDetails.userId)
      throw unauthorizedError(
        "You can't delete this product, it doesn't belong to you!"
      );

    await productRepository.deleteProductById(productId);
  },
};
