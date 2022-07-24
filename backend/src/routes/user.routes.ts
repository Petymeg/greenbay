import express from 'express';
import { userController } from '../controllers/userController';

const userRouter = express.Router();

/**
 * @swagger
 * /api/user/register:
 *  post:
 *      tags:
 *      - USER
 *      description: Register a new user
 *      parameters:
 *          - in: body
 *            name: User Registration object
 *            description: Provides necessary registration parameters
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  example: UserName
 *                password:
 *                  type: string
 *                  example: 12345678
 *                  summary: Must be at least 8 characters long
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Bad Request
 *          409:
 *              description: Conflict - Username is already taken
 *          500:
 *              description: Internal server error
 */
userRouter.post('/register', userController.register);

/**
 * @swagger
 * /api/user/login:
 *  post:
 *      tags:
 *      - USER
 *      description: User login
 *      parameters:
 *          - in: body
 *            name: User Login object
 *            description: Provides necessary login parameters
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  example: UserName
 *                password:
 *                  type: string
 *                  example: 12345678
 *      responses:
 *          200:
 *              description: Login successful
 *          400:
 *              description: Bad request - either one of the login data is missing
 *          401:
 *              description: Unauthorized - Username or password is incorrect
 *          500:
 *              description: Internal server error
 */
userRouter.post('/login', userController.login);

export default userRouter;
