import { productRepository } from '../../src/repositories/product.repository';
import { userService } from '../../src/services/userService';
import { productService } from '../../src/services/productService';
import {
  forbiddenError,
  notFoundError,
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
    productRepository.getProductById = jest.fn();
    productRepository.setStatusById = jest.fn();

    try {
      //Act
      await productService.setStatus(statusDetails);
    } catch (err) {
      //Assert
      expect(productRepository.getProductById).toHaveBeenCalledTimes(0);
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
    productRepository.getProductById = jest.fn().mockResolvedValue(productData);
    productRepository.setStatusById = jest.fn();

    try {
      //Act
      await productService.setStatus(statusDetails);
    } catch (err) {
      //Assert
      expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(productRepository.getProductById).toHaveBeenCalledWith(
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
    productRepository.getProductById = jest.fn().mockResolvedValue(productData);
    productRepository.setStatusById = jest.fn();

    try {
      //Act
      await productService.setStatus(statusDetails);
    } catch (err) {
      //Assert
      expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(productRepository.getProductById).toHaveBeenCalledWith(
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
    productRepository.getProductById = jest.fn().mockResolvedValue(productData);
    productRepository.setStatusById = jest.fn();

    //Act
    const result = await productService.setStatus(statusDetails);

    //Assert
    expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
    expect(productRepository.getProductById).toHaveBeenCalledWith(
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
    productRepository.getProductById = jest.fn().mockResolvedValue(productData);
    productRepository.setStatusById = jest.fn();

    //Act
    const result = await productService.setStatus(statusDetails);

    //Assert
    expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
    expect(productRepository.getProductById).toHaveBeenCalledWith(
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

describe('productService.getProductById', () => {
  it('Throws error when product is not found', async () => {
    //Arrange
    const productId = 36;
    productRepository.getProductWithOwnerById = jest
      .fn()
      .mockResolvedValue(undefined);

    try {
      //Act
      await productService.getProductById(productId);
    } catch (err) {
      //Assert
      expect(productRepository.getProductWithOwnerById).toHaveBeenCalledTimes(
        1
      );
      expect(productRepository.getProductWithOwnerById).toHaveBeenCalledWith(
        productId
      );
      expect(err).toEqual(notFoundError('Product with this ID not found'));
    }
  });

  it('Throws error when product status is not active', async () => {
    //Arrange
    const productId = 36;
    const productDetails = {
      status: 123,
    };
    productRepository.getProductWithOwnerById = jest
      .fn()
      .mockResolvedValue(productDetails);

    try {
      //Act
      await productService.getProductById(productId);
    } catch (err) {
      //Assert
      expect(productRepository.getProductWithOwnerById).toHaveBeenCalledTimes(
        1
      );
      expect(productRepository.getProductWithOwnerById).toHaveBeenCalledWith(
        productId
      );
      expect(err).toEqual(forbiddenError('This product is not available'));
    }
  });

  it('Gives proper object', async () => {
    //Arrange
    const productId = 36;
    const productDBData = {
      id: 36,
      name: 'One great thing',
      description: 'This is the best!',
      imgUrl: 'http://allthepics.com/beauty1.png',
      price: 200,
      status: 1,
      userId: 12,
      userName: 'John',
    };
    const productDetails = {
      id: 36,
      name: 'One great thing',
      description: 'This is the best!',
      imgUrl: 'http://allthepics.com/beauty1.png',
      price: 200,
      owner: {
        id: 12,
        name: 'John',
      },
    };
    productRepository.getProductWithOwnerById = jest
      .fn()
      .mockResolvedValue(productDBData);

    //Act
    const result = await productService.getProductById(productId);

    //Assert
    expect(productRepository.getProductWithOwnerById).toHaveBeenCalledTimes(1);
    expect(productRepository.getProductWithOwnerById).toHaveBeenCalledWith(
      productId
    );
    expect(result).toEqual(productDetails);
  });
});

describe('productService.buyProduct', () => {
  it('Throws error if item belongs to buyer', async () => {
    //Arrange
    const productId = 36;
    const userId = 12;
    const productData = {
      userId: 12,
    };
    productRepository.getProductById = jest.fn().mockResolvedValue(productData);
    userService.getUserById = jest.fn();
    userService.checkIfUserIdExists = jest.fn();
    productRepository.setStatusById = jest.fn();
    userRepository.deductProductPrice = jest.fn();
    userRepository.addSoldProductPrice = jest.fn();

    try {
      //Act
      await productService.buyProduct(productId, userId);
    } catch (err) {
      //Assert
      expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(productRepository.getProductById).toHaveBeenCalledWith(productId);
      expect(userService.getUserById).toHaveBeenCalledTimes(1);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(userService.checkIfUserIdExists).toHaveBeenCalledTimes(0);
      expect(productRepository.setStatusById).toHaveBeenCalledTimes(0);
      expect(userRepository.deductProductPrice).toHaveBeenCalledTimes(0);
      expect(userRepository.addSoldProductPrice).toHaveBeenCalledTimes(0);
      expect(err).toEqual(
        forbiddenError('Cannot buy item, it belongs to you!')
      );
    }
  });

  it('Throws error if item is not sellable', async () => {
    //Arrange
    const productId = 36;
    const userId = 13;
    const productData = {
      userId: 12,
      status: 0,
    };
    productRepository.getProductById = jest.fn().mockResolvedValue(productData);
    userService.getUserById = jest.fn();
    userService.checkIfUserIdExists = jest.fn();
    productRepository.setStatusById = jest.fn();
    userRepository.deductProductPrice = jest.fn();
    userRepository.addSoldProductPrice = jest.fn();

    try {
      //Act
      await productService.buyProduct(productId, userId);
    } catch (err) {
      //Assert
      expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(productRepository.getProductById).toHaveBeenCalledWith(productId);
      expect(userService.getUserById).toHaveBeenCalledTimes(1);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(userService.checkIfUserIdExists).toHaveBeenCalledTimes(0);
      expect(productRepository.setStatusById).toHaveBeenCalledTimes(0);
      expect(userRepository.deductProductPrice).toHaveBeenCalledTimes(0);
      expect(userRepository.addSoldProductPrice).toHaveBeenCalledTimes(0);
      expect(err).toEqual(forbiddenError('Product not available for buying'));
    }
  });

  it("Throws error if buyer doesn't have enough money", async () => {
    //Arrange
    const productId = 36;
    const userId = 13;
    const productData = {
      userId: 12,
      status: 1,
      price: 1000,
    };
    const buyerData = {
      money: 0,
    };
    productRepository.getProductById = jest.fn().mockResolvedValue(productData);
    userService.getUserById = jest.fn().mockResolvedValue(buyerData);
    userService.checkIfUserIdExists = jest.fn();
    productRepository.setStatusById = jest.fn();
    userRepository.deductProductPrice = jest.fn();
    userRepository.addSoldProductPrice = jest.fn();

    try {
      //Act
      await productService.buyProduct(productId, userId);
    } catch (err) {
      //Assert
      expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(productRepository.getProductById).toHaveBeenCalledWith(productId);
      expect(userService.getUserById).toHaveBeenCalledTimes(1);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(userService.checkIfUserIdExists).toHaveBeenCalledTimes(0);
      expect(productRepository.setStatusById).toHaveBeenCalledTimes(0);
      expect(userRepository.deductProductPrice).toHaveBeenCalledTimes(0);
      expect(userRepository.addSoldProductPrice).toHaveBeenCalledTimes(0);
      expect(err).toEqual(forbiddenError('Cannot buy item, not enough money'));
    }
  });

  it("Throws error if seller account doesn't exist", async () => {
    //Arrange
    const productId = 36;
    const userId = 13;
    const productData = {
      userId: 12,
      status: 1,
      price: 10,
    };
    const buyerData = {
      money: 1000,
    };
    productRepository.getProductById = jest.fn().mockResolvedValue(productData);
    userService.getUserById = jest.fn().mockResolvedValue(buyerData);
    userService.checkIfUserIdExists = jest.fn().mockResolvedValue(false);
    productRepository.setStatusById = jest.fn();
    userRepository.deductProductPrice = jest.fn();
    userRepository.addSoldProductPrice = jest.fn();

    try {
      //Act
      await productService.buyProduct(productId, userId);
    } catch (err) {
      //Assert
      expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(productRepository.getProductById).toHaveBeenCalledWith(productId);
      expect(userService.getUserById).toHaveBeenCalledTimes(1);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(userService.checkIfUserIdExists).toHaveBeenCalledTimes(1);
      expect(userService.checkIfUserIdExists).toHaveBeenCalledWith(
        productData.userId
      );
      expect(productRepository.setStatusById).toHaveBeenCalledTimes(0);
      expect(userRepository.deductProductPrice).toHaveBeenCalledTimes(0);
      expect(userRepository.addSoldProductPrice).toHaveBeenCalledTimes(0);
      expect(err).toEqual(
        notFoundError("Purchase not possible, seller account doesn't exist!")
      );
    }
  });

  it('Proper methods are called if all data checks are passed', async () => {
    //Arrange
    const productId = 36;
    const userId = 13;
    const productData = {
      userId: 12,
      status: 1,
      price: 10,
    };
    const buyerData = {
      money: 1000,
    };
    productRepository.getProductById = jest.fn().mockResolvedValue(productData);
    userService.getUserById = jest.fn().mockResolvedValue(buyerData);
    userService.checkIfUserIdExists = jest.fn().mockResolvedValue(true);
    productRepository.setStatusById = jest.fn();
    userRepository.deductProductPrice = jest.fn();
    userRepository.addSoldProductPrice = jest.fn();

    //Act
    await productService.buyProduct(productId, userId);

    //Assert
    expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
    expect(productRepository.getProductById).toHaveBeenCalledWith(productId);
    expect(userService.getUserById).toHaveBeenCalledTimes(1);
    expect(userService.getUserById).toHaveBeenCalledWith(userId);
    expect(userService.checkIfUserIdExists).toHaveBeenCalledTimes(1);
    expect(userService.checkIfUserIdExists).toHaveBeenCalledWith(
      productData.userId
    );
    expect(productRepository.setStatusById).toHaveBeenCalledTimes(1);
    expect(productRepository.setStatusById).toHaveBeenCalledWith(
      productData.status,
      productId
    );
    expect(userRepository.deductProductPrice).toHaveBeenCalledTimes(1);
    expect(userRepository.deductProductPrice).toHaveBeenCalledWith(
      userId,
      productData.price
    );
    expect(userRepository.addSoldProductPrice).toHaveBeenCalledTimes(1);
    expect(userRepository.addSoldProductPrice).toHaveBeenCalledWith(
      productData.userId,
      productData.price
    );
  });
});

describe('productService.getProductDBData', () => {
  it('Throws error if product is not found in DB', async () => {
    //Arrange
    const productId = 36;
    productRepository.getProductById = jest.fn().mockResolvedValue(undefined);

    try {
      //Act
      await productService.getProductDBData(productId);
    } catch (err) {
      //Assert
      expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(productRepository.getProductById).toHaveBeenCalledWith(productId);
      expect(err).toEqual(notFoundError('Product with this ID not found'));
    }
  });

  it('Gives proper data', async () => {
    //Arrange
    const productId = 36;
    const productDBData = {
      id: 36,
      name: 'One great thing',
      description: 'This is the best!',
      imgUrl: 'http://allthepics.com/beauty1.png',
      price: 200,
      status: 3,
      userId: 12,
      userName: 'John',
    };
    productRepository.getProductById = jest
      .fn()
      .mockResolvedValue(productDBData);

    //Act
    const result = await productService.getProductDBData(productId);

    //Assert
    expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
    expect(productRepository.getProductById).toHaveBeenCalledWith(productId);
    expect(result).toBe(productDBData);
  });
});

describe('productService.editProduct', () => {
  const productDetails = {
    productId: 36,
    name: 'One great thing',
    description: 'This is the best!',
    imgUrl: 'http://allthepics.com/beauty1.png',
    price: 200,
    userId: 12,
  };

  it("Throws error when provided userId doesn't exist", async () => {
    //Arrange
    userService.checkIfUserIdExists = jest.fn().mockResolvedValue(false);
    productRepository.getProductById = jest.fn();
    productRepository.editProductById = jest.fn();

    try {
      //Act
      await productService.editProduct(productDetails);
    } catch (err) {
      //Assert
      expect(userService.checkIfUserIdExists).toHaveBeenCalledTimes(1);
      expect(userService.checkIfUserIdExists).toHaveBeenCalledWith(
        productDetails.userId
      );
      expect(productRepository.getProductById).toHaveBeenCalledTimes(0);
      expect(productRepository.editProductById).toHaveBeenCalledTimes(0);
      expect(err).toEqual(
        notFoundError('Cannot edit product, userId not found in db!')
      );
    }
  });

  it("Throws error when provided userId doesn't match the product's owner's ID", async () => {
    //Arrange
    const productDBData = {
      userId: 13,
    };
    userService.checkIfUserIdExists = jest.fn().mockResolvedValue(true);
    productRepository.getProductById = jest
      .fn()
      .mockResolvedValue(productDBData);
    productRepository.editProductById = jest.fn();

    try {
      //Act
      await productService.editProduct(productDetails);
    } catch (err) {
      //Assert
      expect(userService.checkIfUserIdExists).toHaveBeenCalledTimes(1);
      expect(userService.checkIfUserIdExists).toHaveBeenCalledWith(
        productDetails.userId
      );
      expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(productRepository.getProductById).toHaveBeenCalledWith(
        productDetails.productId
      );
      expect(productRepository.editProductById).toHaveBeenCalledTimes(0);
      expect(err).toEqual(
        forbiddenError("You can't edit this product, it doesn't belong to you!")
      );
    }
  });

  it('Throws error when the product is already sold', async () => {
    //Arrange
    const productDBData = {
      userId: 12,
      status: ProductStatusTypes.Sold,
    };
    userService.checkIfUserIdExists = jest.fn().mockResolvedValue(true);
    productRepository.getProductById = jest
      .fn()
      .mockResolvedValue(productDBData);
    productRepository.editProductById = jest.fn();

    try {
      //Act
      await productService.editProduct(productDetails);
    } catch (err) {
      //Assert
      expect(userService.checkIfUserIdExists).toHaveBeenCalledTimes(1);
      expect(userService.checkIfUserIdExists).toHaveBeenCalledWith(
        productDetails.userId
      );
      expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(productRepository.getProductById).toHaveBeenCalledWith(
        productDetails.productId
      );
      expect(productRepository.editProductById).toHaveBeenCalledTimes(0);
      expect(err).toEqual(
        forbiddenError('Product is already sold, cannot be edited')
      );
    }
  });

  it('Call the proper methods if provided with the correct data', async () => {
    //Arrange
    const productDBData = {
      userId: 12,
      status: ProductStatusTypes.Active,
    };
    userService.checkIfUserIdExists = jest.fn().mockResolvedValue(true);
    productRepository.getProductById = jest
      .fn()
      .mockResolvedValue(productDBData);
    productRepository.editProductById = jest.fn();

    //Act
    await productService.editProduct(productDetails);

    //Assert
    expect(userService.checkIfUserIdExists).toHaveBeenCalledTimes(1);
    expect(userService.checkIfUserIdExists).toHaveBeenCalledWith(
      productDetails.userId
    );
    expect(productRepository.getProductById).toHaveBeenCalledTimes(1);
    expect(productRepository.getProductById).toHaveBeenCalledWith(
      productDetails.productId
    );
    expect(productRepository.editProductById).toHaveBeenCalledTimes(1);
    expect(productRepository.editProductById).toHaveBeenCalledWith(
      productDetails.productId,
      productDetails.name,
      productDetails.description,
      productDetails.imgUrl,
      productDetails.price
    );
  });
});
