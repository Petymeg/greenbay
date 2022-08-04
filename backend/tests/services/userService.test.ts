import { RoleTypes } from '../../src/models/enums/RoleType';
import { userRepository } from '../../src/repositories/user.repository';
import { conflictError } from '../../src/services/generalErrorService';
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
