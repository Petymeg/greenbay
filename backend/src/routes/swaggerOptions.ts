import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerOptions } from 'swagger-ui-express';
import config from '../config';

const swaggerOptions: SwaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Greenbay API',
      version: '1.0.0',
      description: 'Greenbay endpoints',
    },
    servers: [`${config.servers.host}:${config.servers.port}`],
  },
  apis: [
    './src/routes/user.routes.ts',
    './src/routes/userInfo.routes.ts',
    './src/routes/product.routes.ts',
  ],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
