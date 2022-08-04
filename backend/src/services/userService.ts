import { UserDomainModel } from '../models/domain/UserDomainModel';
import { RoleTypes } from '../models/enums/RoleType';
import { UserLoginViewModel } from '../models/view/UserLoginViewModel';
import { UserRegistrationViewModel } from '../models/view/UserRegistrationViewModel';
import { userRepository } from '../repositories/user.repository';
import {
  conflictError,
  forbiddenError,
  notFoundError,
} from './generalErrorService';
import { jwtService } from './JwtService';
import { passwordService } from './passwordService';

export const userService = {
  async register(
    username: string,
    password: string
  ): Promise<UserRegistrationViewModel> {
    if (await this.checkIfUsernameExists(username)) {
      throw conflictError('Username is already taken.');
    }

    const hashedPassword = passwordService.generateHash(password);

    const userId = await userRepository.register(username, hashedPassword);

    const token = jwtService.generateAccessToken(
      userId,
      username,
      RoleTypes.User
    );

    return {
      token,
      username,
    };
  },

  async checkIfUsernameExists(username: string): Promise<boolean> {
    const userData = await userRepository.getUserByName(username);
    return userData ? true : false;
  },

  async login(username: string, password: string): Promise<UserLoginViewModel> {
    const userData = await userRepository.getUserByName(username);

    if (
      !userData ||
      !passwordService.comparePasswords(password, userData.password)
    ) {
      throw forbiddenError('Username or password is incorrect!');
    }

    const token = jwtService.generateAccessToken(
      userData.id,
      username,
      userData.roleId
    );

    return {
      token,
      username,
    };
  },

  async getUserById(userId: number): Promise<UserDomainModel> {
    const userDBData = await userRepository.getUserById(userId);

    if (!userDBData) {
      throw notFoundError('userId not found.');
    }
    return userDBData;
  },
};
