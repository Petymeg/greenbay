import { RoleTypes } from '../../src/models/enums/RoleType';
import { userRepository } from '../../src/repositories/user.repository';
import {
  conflictError,
  forbiddenError,
  notFoundError,
} from '../../src/services/generalErrorService';
import { jwtService } from '../../src/services/JwtService';
import { passwordService } from '../../src/services/passwordService';
import { userService } from '../../src/services/userService';

describe('userService.register', () => {
  it('Give error if username is already taken', async () => {
    //Arrange
    const username = 'Tomi';
    const password = 'VerySecretPassword';
    userService.checkIfUsernameExists = jest
      .fn()
      .mockResolvedValue('Something');
    passwordService.generateHash = jest.fn();
    userRepository.register = jest.fn();
    jwtService.generateAccessToken = jest.fn();

    try {
      //Act
      await userService.register(username, password);
    } catch (err) {
      //Assert
      expect(passwordService.generateHash).toHaveBeenCalledTimes(0);
      expect(userRepository.register).toHaveBeenCalledTimes(0);
      expect(jwtService.generateAccessToken).toHaveBeenCalledTimes(0);
      expect(err).toEqual(conflictError('Username is already taken.'));
    }
  });

  it('Gives proper object', async () => {
    //Arrange
    const username = 'Tomi';
    const password = 'VerySecretPassword';
    const hashedPassword = 'oq837n349qc4mzc9t8vnv';
    const token = 'öpw9843nczia8vzoia';
    userService.checkIfUsernameExists = jest.fn().mockResolvedValue(undefined);
    passwordService.generateHash = jest.fn().mockReturnValue(hashedPassword);
    userRepository.register = jest.fn().mockResolvedValue(12);
    jwtService.generateAccessToken = jest.fn().mockReturnValue(token);

    //Act
    const result = await userService.register(username, password);

    //Assert
    expect(passwordService.generateHash).toHaveBeenCalledTimes(1);
    expect(passwordService.generateHash).toHaveBeenCalledWith(password);
    expect(userRepository.register).toHaveBeenCalledTimes(1);
    expect(userRepository.register).toHaveBeenCalledWith(
      username,
      hashedPassword
    );
    expect(jwtService.generateAccessToken).toHaveBeenCalledTimes(1);
    expect(jwtService.generateAccessToken).toHaveBeenCalledWith(
      12,
      username,
      RoleTypes.User
    );
    expect(result).toEqual({ token, username });
  });
});

describe('userservice.login', () => {
  it("Gives error when user doesn't exist", async () => {
    //Arrange
    const username = 'Tomi';
    const password = 'VerySecretPassword';
    userRepository.getUserByName = jest.fn().mockResolvedValue(undefined);
    passwordService.comparePasswords = jest.fn();
    jwtService.generateAccessToken = jest.fn();

    try {
      //Act
      await userService.login(username, password);
    } catch (err) {
      //Assert
      expect(userRepository.getUserByName).toHaveBeenCalledTimes(1);
      expect(userRepository.getUserByName).toHaveBeenCalledWith(username);
      expect(passwordService.comparePasswords).toHaveBeenCalledTimes(0);
      expect(jwtService.generateAccessToken).toHaveBeenCalledTimes(0);
      expect(err).toEqual(forbiddenError('Username or password is incorrect!'));
    }
  });

  it("Gives error when passwords don't match", async () => {
    //Arrange
    const username = 'Tomi';
    const password = 'VerySecretPassword';
    const userData = {
      password: 'anc3834ztvomo4v',
    };
    userRepository.getUserByName = jest.fn().mockResolvedValue(userData);
    passwordService.comparePasswords = jest.fn().mockReturnValue(false);
    jwtService.generateAccessToken = jest.fn();

    try {
      //Act
      await userService.login(username, password);
    } catch (err) {
      //Assert
      expect(userRepository.getUserByName).toHaveBeenCalledTimes(1);
      expect(userRepository.getUserByName).toHaveBeenCalledWith(username);
      expect(passwordService.comparePasswords).toHaveBeenCalledTimes(1);
      expect(passwordService.comparePasswords).toHaveBeenCalledWith(
        password,
        userData.password
      );
      expect(jwtService.generateAccessToken).toHaveBeenCalledTimes(0);
      expect(err).toEqual(forbiddenError('Username or password is incorrect!'));
    }
  });

  it('Gives proper object', async () => {
    //Arrange
    const username = 'Tomi';
    const password = 'VerySecretPassword';
    const userData = {
      id: 12,
      password: 'anc3834ztvomo4v',
      roleId: 2,
    };
    const token = 'öpw9843nczia8vzoia';
    userRepository.getUserByName = jest.fn().mockResolvedValue(userData);
    passwordService.comparePasswords = jest.fn().mockReturnValue(true);
    jwtService.generateAccessToken = jest.fn().mockReturnValue(token);

    //Act
    const result = await userService.login(username, password);

    //Assert
    expect(userRepository.getUserByName).toHaveBeenCalledTimes(1);
    expect(userRepository.getUserByName).toHaveBeenCalledWith(username);
    expect(passwordService.comparePasswords).toHaveBeenCalledTimes(1);
    expect(passwordService.comparePasswords).toHaveBeenCalledWith(
      password,
      userData.password
    );
    expect(jwtService.generateAccessToken).toHaveBeenCalledTimes(1);
    expect(jwtService.generateAccessToken).toHaveBeenCalledWith(
      userData.id,
      username,
      userData.roleId
    );
    expect(result).toEqual({ token, username });
  });
});

describe('userService.getUserById', () => {
  it('Gives error if user is not found', async () => {
    //Arrange
    const userId = 12;
    userRepository.getUserById = jest.fn().mockResolvedValue(undefined);

    try {
      //Act
      await userService.getUserById(userId);
    } catch (err) {
      //Assert
      expect(userRepository.getUserById).toHaveBeenCalledTimes(1);
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(err).toEqual(notFoundError('userId not found.'));
    }
  });

  it('Gives proper object', async () => {
    //Arrange
    const userId = 12;
    const userDBData = {
      id: 12,
      name: 'Tomi',
      password: 'anc3834ztvomo4v',
      roleId: 2,
      money: 10000,
    };
    userRepository.getUserById = jest.fn().mockResolvedValue(userDBData);

    //Act
    const result = await userService.getUserById(userId);

    //Assert
    expect(userRepository.getUserById).toHaveBeenCalledTimes(1);
    expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
    expect(result).toEqual(userDBData);
  });
});
