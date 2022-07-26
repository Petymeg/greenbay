import { UserDomainModel } from '../models/domain/UserDomainModel';
import { RoleTypes } from '../models/enums/RoleType';
import { UserInfoViewModel } from '../models/view/UserInfoViewModel';
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
      money: 0,
    };
  },

  async checkIfUsernameExists(username: string): Promise<boolean> {
    return !!(await userRepository.getUserByName(username));
  },

  async checkIfUserIdExists(userId: number): Promise<boolean> {
    return !!(await userRepository.getUserById(userId));
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
      money: userData.money,
    };
  },

  async getUserById(userId: number): Promise<UserDomainModel> {
    const userDBData = await userRepository.getUserById(userId);

    if (!userDBData) {
      throw notFoundError('userId not found.');
    }
    return userDBData;
  },

  async getUserInfo(userId: number): Promise<UserInfoViewModel> {
    const userData = await this.getUserById(userId);

    return {
      money: userData.money,
    };
  },
};
