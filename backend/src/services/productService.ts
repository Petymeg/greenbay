import { AddUserProductRequestModel } from '../models/common/AddUserProductRequestModel';
import { ProductWithOwnerViewModel } from '../models/view/ProductWithOwnerViewModel';
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

  async deleteProduct(productId: number, userId: number): Promise<string> {
    const productDetails = await productRepository.getProductById(productId);

    if (!productDetails) throw notFoundError('Product with this ID not found');

    if (userId !== productDetails.userId)
      throw unauthorizedError(
        "You can't delete this product, it doesn't belong to you!"
      );

    await productRepository.deleteProductById(productId);

    return `Listing for "${productId} - ${productDetails.name}" deleted`;
  },

  async getSellableProducts(): Promise<ProductWithOwnerViewModel[]> {
    const productDBData = await productRepository.getSellableProducts();

    return productDBData.map((x) => {
      return {
        id: x.id,
        name: x.name,
        imgUrl: x.imgUrl,
        price: x.price,
        owner: {
          id: x.userId,
          name: x.userName,
        },
      };
    });
  },
};
