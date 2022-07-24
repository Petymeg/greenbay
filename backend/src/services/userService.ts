import { UserRegistrationViewModel } from '../models/view/UserRegistrationViewModel';
import { userRepository } from '../repositories/user.repository';
import { conflictError } from './generalErrorService';
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
      name: username,
    };
  },

  async checkIfUsernameExists(username: string): Promise<boolean> {
    const userData = await userRepository.getUserByName(username);
    return userData ? true : false;
  },
};
