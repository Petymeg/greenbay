import { AddUserProductRequestModel } from '../models/common/AddUserProductRequestModel';
import { ProductWithOwnerViewModel } from '../models/view/ProductWithOwnerViewModel';
import { productRepository } from '../repositories/product.repository';
import {
  forbiddenError,
  notFoundError,
  unauthorizedError,
} from './generalErrorService';
import { userService } from './userService';

export const productService = {
  async addUserProduct(
    productDetails: AddUserProductRequestModel
  ): Promise<number> {
    await userService.getUserById(productDetails.userId);

    return await productRepository.addUserProduct(productDetails);
  },

  async delistProduct(productId: number, userId: number): Promise<string> {
    const productDetails = await productRepository.getProductById(productId);

    if (!productDetails) throw notFoundError('Product with this ID not found');

    if (userId !== productDetails.userId)
      throw unauthorizedError(
        "You can't delist this product, it doesn't belong to you!"
      );

    if (!productDetails.active)
      throw forbiddenError('Product is already inactive');

    await productRepository.delistProductById(productId);

    return `Listing for "${productId} - ${productDetails.name}" deleted`;
  },

  async getSellableProducts(): Promise<ProductWithOwnerViewModel[]> {
    const productDBData = await productRepository.getSellableProducts();

    return productDBData.map((x) => {
      return {
        id: x.id,
        name: x.name,
        description: x.description,
        imgUrl: x.imgUrl,
        price: x.price,
        owner: {
          id: x.userId,
          name: x.userName,
        },
      };
    });
  },

  async getProductById(productId: number): Promise<ProductWithOwnerViewModel> {
    const productDetails = await productRepository.getProductWithOwnerById(
      productId
    );

    if (!productDetails) throw notFoundError('Product with this ID not found');

    if (!productDetails.active)
      throw forbiddenError('This product is not available');

    return {
      id: productDetails.id,
      name: productDetails.name,
      description: productDetails.description,
      imgUrl: productDetails.imgUrl,
      price: productDetails.price,
      owner: {
        id: productDetails.userId,
        name: productDetails.userName,
      },
    };
  },
};
