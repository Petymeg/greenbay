import { NextFunction, Request, Response } from 'express';
import { UserLoginRequestViewModel } from '../models/common/UserLoginRequestViewModel';
import { UserRegistrationRequestViewModel } from '../models/common/UserRegistrationRequestViewModel';
import { UserInfoViewModel } from '../models/view/UserInfoViewModel';
import { UserRegistrationViewModel } from '../models/view/UserRegistrationViewModel';
import { badRequestError } from '../services/generalErrorService';
import { jwtService } from '../services/JwtService';
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

  async login(
    req: Request<UserLoginRequestViewModel>,
    res: Response<UserRegistrationViewModel>,
    next: NextFunction
  ) {
    const { username, password } = req.body;

    if (!username && !password) {
      next(badRequestError('All fields are required'));
      return;
    }

    if (!password) {
      next(badRequestError('Password is required'));
      return;
    }

    if (!username) {
      next(badRequestError('Username is required'));
      return;
    }

    try {
      const userData = await userService.login(username, password);
      res.status(200).send(userData);
    } catch (error) {
      next(error);
    }
  },

  async getUserInfo(
    req: Request,
    res: Response<UserInfoViewModel>,
    next: NextFunction
  ) {
    const token = jwtService.getTokenFromRequest(req);
    const { userId } = jwtService.getTokenPayload(token);

    try {
      const userInfo = await userService.getUserInfo(userId);
      res.status(200).send(userInfo);
    } catch (error) {
      next(error);
    }
  },
};
