import app from '../../src/app';
import request from 'supertest';
import { jwtService } from '../../src/services/JwtService';
import { productService } from '../../src/services/productService';

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
