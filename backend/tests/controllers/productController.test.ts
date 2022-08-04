import app from '../../src/app';
import request from 'supertest';
import { jwtService } from '../../src/services/JwtService';
import { productService } from '../../src/services/productService';
import { ProductStatusTypes } from '../../src/models/enums/ProductStatusTypes';

describe('productController.addUserProduct()', () => {
  const token = 'asdkfahdlfkas';
  const tokenData = {
    userId: 20,
  };

  beforeEach(() => {
    jwtService.getTokenFromRequest = jest.fn().mockReturnValue(token);
    jwtService.verifyToken = jest.fn().mockReturnValue(true);
    jwtService.getTokenPayload = jest.fn().mockReturnValue(tokenData);
    console.error = jest.fn();
  });

  it('Error code 400 when no product data is provided', async () => {
    //Arrange
    //Act
    const result = await request(app).post('/api/product').send({});

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when name is not provided', async () => {
    //Arrange
    const productData = {
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
    };

    //Act
    const result = await request(app).post('/api/product').send(productData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when description is not provided', async () => {
    //Arrange
    const productData = {
      name: 'Something Awesome',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
    };

    //Act
    const result = await request(app).post('/api/product').send(productData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when imgUrl is not provided', async () => {
    //Arrange
    const productData = {
      name: 'Something Awesome',
      description: 'This is the best!',
      price: 300,
    };

    //Act
    const result = await request(app).post('/api/product').send(productData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when price is not provided', async () => {
    //Arrange
    const productData = {
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
    };

    //Act
    const result = await request(app).post('/api/product').send(productData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 500 when service fails', async () => {
    //Arrange
    const productData = {
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
    };
    const productDetails = {
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
      userId: tokenData.userId,
    };
    productService.addUserProduct = jest.fn().mockRejectedValue('error');

    //Act
    const result = await request(app).post('/api/product').send(productData);

    //Assert
    expect(productService.addUserProduct).toHaveBeenCalledWith(productDetails);
    expect(productService.addUserProduct).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toEqual(500);
  });

  it('Proper object is sent when product addition is successful', async () => {
    //Arrange
    const productData = {
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
    };
    const productDetails = {
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
      userId: tokenData.userId,
    };
    const productId = 12;
    productService.addUserProduct = jest.fn().mockResolvedValue(productId);

    //Act
    const result = await request(app).post('/api/product').send(productData);

    //Assert
    expect(productService.addUserProduct).toHaveBeenCalledWith(productDetails);
    expect(productService.addUserProduct).toHaveBeenCalledTimes(1);
    expect(result.body).toEqual({ productId });
    expect(result.statusCode).toEqual(201);
  });
});

describe('productController.setStatus()', () => {
  const token = 'asdkfahdlfkas';
  const tokenData = {
    userId: 20,
  };

  beforeEach(() => {
    jwtService.getTokenFromRequest = jest.fn().mockReturnValue(token);
    jwtService.verifyToken = jest.fn().mockReturnValue(true);
    jwtService.getTokenPayload = jest.fn().mockReturnValue(tokenData);
    console.error = jest.fn();
  });

  it('Error code 400 when productId is not provided', async () => {
    //Arrange
    const statusData = {
      statusCode: 0,
    };

    //Act
    const result = await request(app)
      .put('/api/product/setstatus')
      .send(statusData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when statusCode is not provided', async () => {
    //Arrange
    const statusData = {
      productId: 12,
    };

    //Act
    const result = await request(app)
      .put('/api/product/setstatus')
      .send(statusData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when statusCode is not valid', async () => {
    //Arrange
    const statusData = {
      productId: 12,
      statusCode: 82345692834756,
    };

    //Act
    const result = await request(app)
      .put('/api/product/setstatus')
      .send(statusData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 500 when service fails', async () => {
    //Arrange
    const statusData = {
      productId: 12,
      statusCode: 0,
    };
    const statusDetails = {
      productId: 12,
      statusCode: 0,
      userId: tokenData.userId,
    };
    productService.setStatus = jest.fn().mockRejectedValue('error');

    //Act
    const result = await request(app)
      .put(`/api/product/setstatus`)
      .send(statusData);

    //Assert
    expect(productService.setStatus).toHaveBeenCalledWith(statusDetails);
    expect(productService.setStatus).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toEqual(500);
  });

  it('Proper object is sent when product addition is successful', async () => {
    //Arrange
    const statusData = {
      productId: 12,
      statusCode: 0,
    };
    const statusDetails = {
      productId: 12,
      statusCode: 0,
      userId: tokenData.userId,
    };
    productService.setStatus = jest.fn().mockResolvedValue('Success');

    //Act
    const result = await request(app)
      .put(`/api/product/setstatus`)
      .send(statusData);

    //Assert
    expect(productService.setStatus).toHaveBeenCalledWith(statusDetails);
    expect(productService.setStatus).toHaveBeenCalledTimes(1);
    expect(result.body).toEqual({ statusCode: statusDetails.statusCode });
    expect(result.statusCode).toEqual(200);
  });
});

describe('productController.getSellableProducts()', () => {
  const token = 'asdkfahdlfkas';
  const tokenData = {
    userId: 20,
  };

  beforeEach(() => {
    jwtService.getTokenFromRequest = jest.fn().mockReturnValue(token);
    jwtService.verifyToken = jest.fn().mockReturnValue(true);
    jwtService.getTokenPayload = jest.fn().mockReturnValue(tokenData);
    console.error = jest.fn();
  });

  it('Error code 500 when service fails', async () => {
    //Arrange
    productService.getSellableProducts = jest.fn().mockRejectedValue('error');

    //Act
    const result = await request(app).get(`/api/product`).send();

    //Assert
    expect(productService.getSellableProducts).toHaveBeenCalledWith();
    expect(productService.getSellableProducts).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toEqual(500);
  });

  it('Proper object is sent', async () => {
    //Arrange
    const productList = [
      {
        id: 9,
        name: 'Something Awesome',
        description: 'This is the best!',
        imgUrl: 'http://valami.hu/szepkep.jpg',
        price: 300,
        owner: {
          id: 16,
          name: 'Tomi',
        },
      },
      {
        id: 10,
        name: 'Something Awesome',
        description: 'This is the best!',
        imgUrl: 'http://valami.hu/szepkep.jpg',
        price: 300,
        owner: {
          id: 16,
          name: 'Tomi',
        },
      },
    ];
    productService.getSellableProducts = jest
      .fn()
      .mockResolvedValue(productList);

    //Act
    const result = await request(app).get(`/api/product`).send();

    //Assert
    expect(productService.getSellableProducts).toHaveBeenCalledWith();
    expect(productService.getSellableProducts).toHaveBeenCalledTimes(1);
    expect(result.body).toEqual(productList);
    expect(result.statusCode).toEqual(200);
  });
});

describe('productController.getProduct()', () => {
  const token = 'asdkfahdlfkas';
  const tokenData = {
    userId: 20,
  };

  beforeEach(() => {
    jwtService.getTokenFromRequest = jest.fn().mockReturnValue(token);
    jwtService.verifyToken = jest.fn().mockReturnValue(true);
    jwtService.getTokenPayload = jest.fn().mockReturnValue(tokenData);
    console.error = jest.fn();
  });

  it('Error code 400 when no poductId is not a number', async () => {
    //Arrange
    //Act
    const result = await request(app).get('/api/product/notanid').send();

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 500 when service fails', async () => {
    //Arrange
    const productId = 12;
    productService.getProductById = jest.fn().mockRejectedValue('error');

    //Act
    const result = await request(app).get(`/api/product/${productId}`).send();

    //Assert
    expect(productService.getProductById).toHaveBeenCalledWith(productId);
    expect(productService.getProductById).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toEqual(500);
  });

  it('Proper object is sent when product addition is successful', async () => {
    //Arrange
    const productId = 12;
    const productDetails = {
      id: 12,
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
      owner: {
        id: 16,
        name: 'Tomi',
      },
    };
    productService.getProductById = jest.fn().mockResolvedValue(productDetails);

    //Act
    const result = await request(app).get(`/api/product/${productId}`).send();

    //Assert
    expect(productService.getProductById).toHaveBeenCalledWith(productId);
    expect(productService.getProductById).toHaveBeenCalledTimes(1);
    expect(result.body).toEqual(productDetails);
    expect(result.statusCode).toEqual(200);
  });
});

describe('productController.getProduct()', () => {
  const token = 'asdkfahdlfkas';
  const tokenData = {
    userId: 20,
  };

  beforeEach(() => {
    jwtService.getTokenFromRequest = jest.fn().mockReturnValue(token);
    jwtService.verifyToken = jest.fn().mockReturnValue(true);
    jwtService.getTokenPayload = jest.fn().mockReturnValue(tokenData);
    console.error = jest.fn();
  });

  it('Error code 400 when no productId is provided', async () => {
    //Arrange
    //Act
    const result = await request(app).post(`/api/product/buy`).send({});

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 500 when service fails', async () => {
    //Arrange
    const productId = 12;
    productService.buyProduct = jest.fn().mockRejectedValue('error');

    //Act
    const result = await request(app)
      .post(`/api/product/buy`)
      .send({ productId });

    //Assert
    expect(productService.buyProduct).toHaveBeenCalledWith(
      productId,
      tokenData.userId
    );
    expect(productService.buyProduct).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toEqual(500);
  });

  it('Status 200 when pruchase is successful', async () => {
    //Arrange
    const productId = 12;
    productService.buyProduct = jest.fn();

    //Act
    const result = await request(app)
      .post(`/api/product/buy`)
      .send({ productId });

    //Assert
    expect(productService.buyProduct).toHaveBeenCalledWith(
      productId,
      tokenData.userId
    );
    expect(productService.buyProduct).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toEqual(200);
  });
});

describe('productController.editProduct()', () => {
  const token = 'asdkfahdlfkas';
  const tokenData = {
    userId: 20,
  };

  beforeEach(() => {
    jwtService.getTokenFromRequest = jest.fn().mockReturnValue(token);
    jwtService.verifyToken = jest.fn().mockReturnValue(true);
    jwtService.getTokenPayload = jest.fn().mockReturnValue(tokenData);
    console.error = jest.fn();
  });

  it('Error code 400 when product id is not provided', async () => {
    //Arrange
    const productData = {
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
    };

    //Act
    const result = await request(app).put(`/api/product`).send(productData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when name is not provided', async () => {
    //Arrange
    const productData = {
      productId: 12,
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
    };

    //Act
    const result = await request(app).put(`/api/product`).send(productData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when description is not provided', async () => {
    //Arrange
    const productData = {
      productId: 12,
      name: 'Something Awesome',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
    };

    //Act
    const result = await request(app).put(`/api/product`).send(productData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when imgUrl is not provided', async () => {
    //Arrange
    const productData = {
      productId: 12,
      name: 'Something Awesome',
      description: 'This is the best!',
      price: 300,
    };

    //Act
    const result = await request(app).put(`/api/product`).send(productData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when price is not provided', async () => {
    //Arrange
    const productData = {
      productId: 12,
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
    };

    //Act
    const result = await request(app).put(`/api/product`).send(productData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 500 when service fails', async () => {
    //Arrange
    const productData = {
      productId: 12,
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
    };
    const productDetails = {
      productId: 12,
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
      userId: tokenData.userId,
    };
    productService.editProduct = jest.fn().mockRejectedValue('error');

    //Act
    const result = await request(app).put(`/api/product`).send(productData);

    //Assert
    expect(productService.editProduct).toHaveBeenCalledWith(productDetails);
    expect(productService.editProduct).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toEqual(500);
  });

  it('Proper object is sent when product addition is successful', async () => {
    //Arrange
    const productData = {
      productId: 12,
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
    };
    const productDetails = {
      productId: 12,
      name: 'Something Awesome',
      description: 'This is the best!',
      imgUrl: 'http://valami.hu/szepkep.jpg',
      price: 300,
      userId: tokenData.userId,
    };
    productService.editProduct = jest.fn();

    //Act
    const result = await request(app).put(`/api/product`).send(productData);

    //Assert
    expect(productService.editProduct).toHaveBeenCalledWith(productDetails);
    expect(productService.editProduct).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toEqual(200);
  });
});
