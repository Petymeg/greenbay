import { productRepository } from '../../src/repositories/product.repository';
import { userService } from '../../src/services/userService';
import { productService } from '../../src/services/productService';
import {
  forbiddenError,
  unauthorizedError,
} from '../../src/services/generalErrorService';
import { userRepository } from '../../src/repositories/user.repository';
import { ProductStatusTypes } from '../../src/models/enums/ProductStatusTypes';

describe('productService.addUserProduct', () => {
  it('Gives err if userService.getUserById fails', async () => {
    //Arrange
    const productDetails = {
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
      userId: 12,
    };
    userService.checkIfUserIdExists = jest.fn().mockResolvedValue(false);
    productRepository.addUserProduct = jest.fn();

    try {
      //Act
      await productService.addUserProduct(productDetails);
    } catch (err) {
      //Assert
      expect(userService.checkIfUserIdExists).toHaveBeenCalledTimes(1);
      expect(userService.checkIfUserIdExists).toHaveBeenCalledWith(
        productDetails.userId
      );
      expect(productRepository.addUserProduct).toHaveBeenCalledTimes(0);
      expect(err).toEqual(
        forbiddenError('Cannot add product, userId not found in db!')
      );
    }
  });

  it('Gives proper result', async () => {
    //Arrange
    const productDetails = {
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
      userId: 12,
    };
    const productId = 36;
    userService.checkIfUserIdExists = jest.fn().mockResolvedValue(true);
    productRepository.addUserProduct = jest.fn().mockResolvedValue(productId);

    //Act
    const result = await productService.addUserProduct(productDetails);

    //Assert
    expect(userService.checkIfUserIdExists).toHaveBeenCalledTimes(1);
    expect(userService.checkIfUserIdExists).toHaveBeenCalledWith(
      productDetails.userId
    );
    expect(productRepository.addUserProduct).toHaveBeenCalledTimes(1);
    expect(productRepository.addUserProduct).toHaveBeenCalledWith(
      productDetails
    );
    expect(result).toEqual(productId);
  });
});

describe('productService.setStatus', () => {
  it('Throws error when trying to set status to "sold"', async () => {
    //Arrange
    const statusDetails = {
      userId: 12,
      productId: 36,
      statusCode: ProductStatusTypes.Sold,
    };
    productService.getProductDBData = jest.fn();
    productRepository.setStatusById = jest.fn();

    try {
      //Act
      await productService.setStatus(statusDetails);
    } catch (err) {
      //Assert
      expect(productService.getProductDBData).toHaveBeenCalledTimes(0);
      expect(productRepository.setStatusById).toHaveBeenCalledTimes(0);
      expect(err).toEqual(
        forbiddenError(
          'You cannot set an item to "sold" without actually selling it'
        )
      );
    }
  });

  it('Throws error if requestor and owner user is not the same', async () => {
    //Arrange
    const statusDetails = {
      userId: 12,
      productId: 36,
      statusCode: 0,
    };
    const productData = {
      userId: 13,
    };
    productService.getProductDBData = jest.fn().mockResolvedValue(productData);
    productRepository.setStatusById = jest.fn();

    try {
      //Act
      await productService.setStatus(statusDetails);
    } catch (err) {
      //Assert
      expect(productService.getProductDBData).toHaveBeenCalledTimes(1);
      expect(productService.getProductDBData).toHaveBeenCalledWith(
        statusDetails.productId
      );
      expect(productRepository.setStatusById).toHaveBeenCalledTimes(0);
      expect(err).toEqual(
        unauthorizedError(
          "You cannot change the status of this product, it doesn't belong to you!"
        )
      );
    }
  });

  it('Throws error if the item is already sold', async () => {
    //Arrange
    const statusDetails = {
      userId: 12,
      productId: 36,
      statusCode: 0,
    };
    const productData = {
      userId: 12,
      status: ProductStatusTypes.Sold,
    };
    productService.getProductDBData = jest.fn().mockResolvedValue(productData);
    productRepository.setStatusById = jest.fn();

    try {
      //Act
      await productService.setStatus(statusDetails);
    } catch (err) {
      //Assert
      expect(productService.getProductDBData).toHaveBeenCalledTimes(1);
      expect(productService.getProductDBData).toHaveBeenCalledWith(
        statusDetails.productId
      );
      expect(productRepository.setStatusById).toHaveBeenCalledTimes(0);
      expect(err).toEqual(
        forbiddenError('You cannot change the status of a sold item!')
      );
    }
  });

  it('Gives proper result - future and current status is the same', async () => {
    //Arrange
    const statusDetails = {
      userId: 12,
      productId: 36,
      statusCode: 0,
    };
    const productData = {
      userId: 12,
      status: 0,
    };
    productService.getProductDBData = jest.fn().mockResolvedValue(productData);
    productRepository.setStatusById = jest.fn();

    //Act
    const result = await productService.setStatus(statusDetails);

    //Assert
    expect(productService.getProductDBData).toHaveBeenCalledTimes(1);
    expect(productService.getProductDBData).toHaveBeenCalledWith(
      statusDetails.productId
    );
    expect(productRepository.setStatusById).toHaveBeenCalledTimes(0);
    expect(result).toEqual({ statusCode: statusDetails.statusCode });
  });

  it('Gives proper result - future and current status is different', async () => {
    //Arrange
    const statusDetails = {
      userId: 12,
      productId: 36,
      statusCode: 0,
    };
    const productData = {
      userId: 12,
      status: 1,
    };
    productService.getProductDBData = jest.fn().mockResolvedValue(productData);
    productRepository.setStatusById = jest.fn();

    //Act
    const result = await productService.setStatus(statusDetails);

    //Assert
    expect(productService.getProductDBData).toHaveBeenCalledTimes(1);
    expect(productService.getProductDBData).toHaveBeenCalledWith(
      statusDetails.productId
    );
    expect(productRepository.setStatusById).toHaveBeenCalledTimes(1);
    expect(productRepository.setStatusById).toHaveBeenCalledWith(
      statusDetails.productId,
      statusDetails.statusCode
    );
    expect(result).toEqual({ statusCode: statusDetails.statusCode });
  });
});

describe('productService.getSellableProducts', () => {
  it('Gives proper object', async () => {
    //Arrange
    const productDBData = [
      {
        id: 1,
        name: 'One great thing',
        description: 'This is the best!',
        imgUrl: 'http://allthepics.com/beauty1.png',
        price: 200,
        status: 1,
        userId: 12,
        userName: 'John',
      },
      {
        id: 2,
        name: 'Two great things',
        description: 'This is the second best!',
        imgUrl: 'http://allthepics.com/beauty2.png',
        price: 200,
        status: 1,
        userId: 13,
        userName: 'Smith',
      },
    ];
    const sellableItems = [
      {
        id: 1,
        name: 'One great thing',
        description: 'This is the best!',
        imgUrl: 'http://allthepics.com/beauty1.png',
        price: 200,
        owner: {
          id: 12,
          name: 'John',
        },
      },
      {
        id: 2,
        name: 'Two great things',
        description: 'This is the second best!',
        imgUrl: 'http://allthepics.com/beauty2.png',
        price: 200,
        owner: {
          id: 13,
          name: 'Smith',
        },
      },
    ];
    productRepository.getSellableProducts = jest
      .fn()
      .mockResolvedValue(productDBData);

    //Act
    const result = await productService.getSellableProducts();

    //Assert
    expect(productRepository.getSellableProducts).toHaveBeenCalledTimes(1);
    expect(productRepository.getSellableProducts).toHaveBeenCalledWith();
    expect(result).toEqual(sellableItems);
  });
});
