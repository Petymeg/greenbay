import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './swaggerOptions';
import userRouter from './user.routes';
import authenticate from '../middlewares/authenticator';
import productRouter from './product.routes';
import userInfoRouter from './userInfo.routes';

const apiRouter = express.Router();

apiRouter.use(cors());
apiRouter.use(express.json());
apiRouter.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
apiRouter.use('/user', userRouter);
apiRouter.use(authenticate);
apiRouter.use('/product', productRouter);
apiRouter.use('/user-info', userInfoRouter);

export default apiRouter;
