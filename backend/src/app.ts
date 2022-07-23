import express from 'express';
import errorHandler from './middlewares/error-handler';
import apiRouter from './routes/api.routes';

const app = express();

app.use('/api', apiRouter);

app.use(errorHandler);

export default app;
