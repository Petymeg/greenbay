import { NextFunction, Request, Response } from 'express';
import { UserRegistrationRequestViewModel } from '../models/common/UserRegistrationRequestViewModel';
import { UserRegistrationViewModel } from '../models/view/UserRegistrationViewModel';
import { badRequestError } from '../services/generalErrorService';
import { userService } from '../services/userService';

export const userController = {
  async register(
    req: Request<UserRegistrationRequestViewModel>,
    res: Response<UserRegistrationViewModel>,
    next: NextFunction
  ) {
    const { username, password } = req.body;

    if (!username && !password) {
      return next(badRequestError('Username and password are required.'));
    }

    if (!password) {
      return next(badRequestError('Password is required.'));
    }

    if (!username) {
      return next(badRequestError('Username is required.'));
    }

    if (password.length < 8) {
      return next(badRequestError('Password must be at least 8 characters.'));
    }

    try {
      const userData = await userService.register(username, password);
      res.status(201).send(userData);
    } catch (err) {
      next(err);
    }
  },
};
