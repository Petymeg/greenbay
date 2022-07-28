import express from 'express';
import { productController } from '../controllers/productController';

const productRouter = express.Router();

/**
 * @swagger
 * /api/product:
 *  post:
 *      tags:
 *      - PRODUCT
 *      description: Add a new product listing
 *      parameters:
 *          - in: header
 *            name: authorization
 *            schema:
 *              type: string
 *              example: Bearer rh4b5b435njfd
 *          - in: body
 *            name: productDetails
 *            description: Provide the necessary details for the listing
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: Awesome product
 *                description:
 *                  type: string
 *                  example: This is the best there is
 *                imgUrl:
 *                  type: string
 *                  example: https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c06643713.png
 *                price:
 *                  type: number
 *                  example: 100
 *      responses:
 *          200:
 *              description: New product listing created
 *          400:
 *              description: Product detail missing
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Internal server error
 */
productRouter.post('', productController.addUserProduct);

/**
 * @swagger
 * /api/product/{productId}:
 *  delete:
 *      tags:
 *      - PRODUCT
 *      description: Delete a product listing
 *      parameters:
 *          - in: header
 *            name: authorization
 *            schema:
 *              type: string
 *              example: Bearer rh4b5b435njfd
 *          - in: path
 *            name: productId
 *            description: Product ID to be deleted
 *            schema:
 *              type: number
 *              example: 1
 *      responses:
 *          200:
 *              description: Listing deleted
 *          400:
 *              description: productId missing from request body
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden - Product doesn't belong to logged in user
 *          404:
 *              description: Product not found
 *          500:
 *              description: Internal server error
 */
productRouter.delete('/:productId', productController.deleteProduct);

/**
 * @swagger
 * /api/product:
 *  get:
 *      tags:
 *      - PRODUCT
 *      description: Get all sellable products
 *      parameters:
 *          - in: header
 *            name: authorization
 *            schema:
 *              type: string
 *              example: Bearer rh4b5b435njfd
 *      responses:
 *          200:
 *              description: Data provided
 *          500:
 *              description: Internal server error
 */
productRouter.get('', productController.getSellableProducts);

export default productRouter;
