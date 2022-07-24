import { UserRegistrationViewModel } from '../models/view/UserRegistrationViewModel';
import { userRepository } from '../repositories/user.repository';
import {
  badRequestError,
  conflictError,
  unauthorizedError,
} from './generalErrorService';
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

    return {
      id: userId,
      username,
      roleId: 2,
    };
  },

  async checkIfUsernameExists(username: string): Promise<boolean> {
    const userData = await userRepository.getUserByName(username);
    return userData ? true : false;
  },

  async login(
    username: string,
    password: string
  ): Promise<UserRegistrationViewModel> {
    const userData = await userRepository.getUserByName(username);

    if (
      !userData ||
      !passwordService.comparePasswords(password, userData.password)
    ) {
      throw unauthorizedError('Username or password is incorrect!');
    }

    return {
      id: userData.id,
      username: userData.name,
      roleId: userData.roleId,
    };
  },
};
