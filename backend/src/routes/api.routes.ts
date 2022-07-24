import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './swaggerOptions';
import userRouter from './user.routes';
import authenticate from '../middlewares/authenticator';

const apiRouter = express.Router();

apiRouter.use(cors());
apiRouter.use(express.json());
apiRouter.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
apiRouter.use('/user', userRouter);
apiRouter.use(authenticate);

export default apiRouter;
