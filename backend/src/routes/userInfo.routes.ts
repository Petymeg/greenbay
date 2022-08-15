import express from 'express';
import { userController } from '../controllers/userController';

const userInfoRouter = express.Router();

/**
 * @swagger
 * /api/user-info:
 *  get:
 *      tags:
 *      - USERINFO
 *      description: Get user details
 *      parameters:
 *          - in: header
 *            name: authorization
 *            schema:
 *              type: string
 *              example: Bearer rh4b5b435njfd
 *      responses:
 *          200:
 *              description: Data provided
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal server error
 */
userInfoRouter.get('', userController.getUserInfo);

export default userInfoRouter;
