import config from '../config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { JwtTokenPayloadModel } from '../models/common/JwtTokenPayloadModel';

export const jwtService = {
  generateAccessToken(
    userId: number,
    username: string,
    roleId: number
  ): string {
    const payLoad = {
      userId,
      username,
      roleId,
    };

    return jwt.sign(payLoad, config.jwt.secretKey as string, {
      expiresIn: '1d',
    });
  },

  getTokenFromRequest(req: Request<any>): string {
    return req.headers.authorization?.split(' ')[1] as string;
  },

  verifyToken(token: string): boolean {
    try {
      jwt.verify(token, config.jwt.secretKey as string);
      return true;
    } catch {
      return false;
    }
  },

  getTokenPayload(token: string): JwtTokenPayloadModel {
    return jwt.decode(token) as JwtTokenPayloadModel;
  },
};
