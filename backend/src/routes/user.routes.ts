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

export default userRouter;
