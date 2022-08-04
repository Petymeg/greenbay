import { AddUserProductRequestModel } from '../models/common/AddUserProductRequestModel';
import { EditProductRequestModel } from '../models/common/EditProductRequestModel';
import { ProductStatusRequestModel } from '../models/common/ProductStatusRequestModel';
import { ProductStatusViewModel } from '../models/common/ProductStatusViewModel';
import { UserProductDomainModel } from '../models/domain/UserProductDomainModel';
import { ProductStatusTypes } from '../models/enums/ProductStatusTypes';
import { ProductWithOwnerViewModel } from '../models/view/ProductWithOwnerViewModel';
import { productRepository } from '../repositories/product.repository';
import { userRepository } from '../repositories/user.repository';
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

  async setStatus(
    statusDetails: ProductStatusRequestModel
  ): Promise<ProductStatusViewModel> {
    const productData = await this.getProductDBData(statusDetails.productId);

    if (statusDetails.userId !== productData.userId)
      throw unauthorizedError(
        "You cannot change the status of this product, it doesn't belong to you!"
      );

    if (productData.status === ProductStatusTypes.Sold)
      throw forbiddenError('You cannot change the status of a sold item!');

    if (statusDetails.statusCode !== productData.status) {
      await productRepository.setStatusById(
        statusDetails.productId,
        statusDetails.statusCode
      );
    }

    return { statusCode: statusDetails.statusCode };
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

    if (productDetails.status !== ProductStatusTypes.Active)
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

  async buyProduct(productId: number, userId: number): Promise<void> {
    const productData = await this.getProductDBData(productId);
    const buyerData = await userService.getUserById(userId);

    if (productData.userId === userId)
      throw forbiddenError('Cannot buy item, it belongs to you!');

    if (productData.status !== ProductStatusTypes.Active)
      throw forbiddenError('Product not available for buying');

    if (productData.price > buyerData.money)
      throw forbiddenError('Cannot buy item, not enough money');

    const sellerData = await userService.getUserById(productData.userId);

    await productRepository.setStatusById(productData.status, productId);
    await userRepository.deductProductPrice(userId, productData.price);
    await userRepository.addSoldProductPrice(
      productData.userId,
      productData.price
    );
  },

  async getProductDBData(productId: number): Promise<UserProductDomainModel> {
    const productData = await productRepository.getProductById(productId);

    if (!productData) throw notFoundError('Product with this ID not found');

    return productData;
  },

  async editProduct(productDetails: EditProductRequestModel): Promise<void> {
    const { productId, name, description, imgUrl, price, userId } =
      productDetails;
    const productDBData = await this.getProductDBData(productId);
    const userDBData = userService.getUserById(userId);

    if (productDBData.userId !== userId)
      throw forbiddenError(
        "You can't edit this product, it doesn't belong to you!"
      );

    if (productDBData.status === ProductStatusTypes.Sold)
      throw forbiddenError('Product is already sold, cannot be edited');

    await productRepository.editProductById(
      productId,
      name,
      description,
      imgUrl,
      price
    );
  },
};
