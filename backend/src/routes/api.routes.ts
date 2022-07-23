import express from 'express';
import cors from 'cors';

const apiRouter = express.Router();

apiRouter.use(cors());
apiRouter.use(express.json());

export default apiRouter;
