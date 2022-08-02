import app from '../../src/app';
import request from 'supertest';
import { userService } from '../../src/services/userService';

describe('userController.register()', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  it('Error code 400 when no userdata is provided', async () => {
    //Arrange
    //Act
    const result = await request(app).post('/api/user/register').send({});

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when password is not provided', async () => {
    //Arrange
    const registrationData = {
      username: 'UserName',
    };

    //Act
    const result = await request(app)
      .post('/api/user/register')
      .send(registrationData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when username is not provided', async () => {
    //Arrange
    const registrationData = {
      password: '12345678',
    };

    //Act
    const result = await request(app)
      .post('/api/user/register')
      .send(registrationData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when password is shorter then 8 characters', async () => {
    //Arrange
    const registrationData = {
      username: 'UserName',
      password: '1234567',
    };

    //Act
    const result = await request(app)
      .post('/api/user/register')
      .send(registrationData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 500 when service fails', async () => {
    //Arrange
    const registrationData = {
      username: 'UserName',
      password: '12345678',
    };
    userService.register = jest.fn().mockRejectedValue('error');

    //Act
    const result = await request(app)
      .post('/api/user/register')
      .send(registrationData);

    //Assert
    expect(userService.register).toHaveBeenCalledWith('UserName', '12345678');
    expect(userService.register).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toEqual(500);
  });

  it('Proper object is sent when registration is successful', async () => {
    //Arrange
    const registrationData = {
      username: 'UserName',
      password: '12345678',
    };
    const userData = {
      token: 'alsdfahskldjladc',
      username: 'UserName',
    };
    userService.register = jest.fn().mockResolvedValue(userData);

    //Act
    const result = await request(app)
      .post('/api/user/register')
      .send(registrationData);

    //Assert
    expect(userService.register).toHaveBeenCalledWith('UserName', '12345678');
    expect(userService.register).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(userData);
  });
});

describe('userController.login()', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  it('Error code 400 when no userdata is provided', async () => {
    //Arrange
    //Act
    const result = await request(app).post('/api/user/login').send({});

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when password is not provided', async () => {
    //Arrange
    const loginData = {
      username: 'UserName',
    };

    //Act
    const result = await request(app).post('/api/user/login').send(loginData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 400 when username is not provided', async () => {
    //Arrange
    const loginData = {
      password: '12345678',
    };

    //Act
    const result = await request(app).post('/api/user/login').send(loginData);

    //Assert
    expect(result.statusCode).toEqual(400);
  });

  it('Error code 500 when service fails', async () => {
    //Arrange
    const loginData = {
      username: 'UserName',
      password: '12345678',
    };
    userService.login = jest.fn().mockRejectedValue('error');

    //Act
    const result = await request(app).post('/api/user/login').send(loginData);

    //Assert
    expect(userService.login).toHaveBeenCalledWith('UserName', '12345678');
    expect(userService.login).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toEqual(500);
  });

  it('Proper object is sent when login is successful', async () => {
    //Arrange
    const loginData = {
      username: 'UserName',
      password: '12345678',
    };
    const userData = {
      token: 'alsdfahskldjladc',
      username: 'UserName',
    };
    userService.login = jest.fn().mockResolvedValue(userData);

    //Act
    const result = await request(app).post('/api/user/login').send(loginData);

    //Assert
    expect(userService.login).toHaveBeenCalledWith('UserName', '12345678');
    expect(userService.login).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(userData);
  });
});
