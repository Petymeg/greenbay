import express from 'express';
import { productController } from '../controllers/productController';

const productRouter = express.Router();

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
 * /api/product:
 *  put:
 *      tags:
 *      - PRODUCT
 *      description: Edit a products details
 *      parameters:
 *          - in: header
 *            name: authorization
 *            schema:
 *              type: string
 *              example: Bearer rh4b5b435njfd
 *          - in: body
 *            name: productData
 *            description: Provide the details of the product you'd like to edit
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: number
 *                  example: 1
 *                name:
 *                  type: string
 *                  example: Something great
 *                description:
 *                  type: string
 *                  example: A great new description
 *                imgUrl:
 *                  type: string
 *                  example: https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg
 *                price:
 *                  type: number
 *                  example: 123
 *      responses:
 *          200:
 *              description: Listing edited
 *          400:
 *              description: Bad request
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden
 *          404:
 *              description: Not found
 *          500:
 *              description: Internal server error
 */
productRouter.put('', productController.editProduct);

/**
 * @swagger
 * /api/product/{productId}:
 *  get:
 *      tags:
 *      - PRODUCT
 *      description: Get a product
 *      parameters:
 *          - in: header
 *            name: authorization
 *            schema:
 *              type: string
 *              example: Bearer rh4b5b435njfd
 *          - in: path
 *            name: productId
 *            description: ID of product
 *            schema:
 *              type: number
 *              example: 1
 *      responses:
 *          200:
 *              description: Listing returned
 *          400:
 *              description: productId missing from request body
 *          403:
 *              description: Forbidden - Product is not active
 *          404:
 *              description: Product not found
 *          500:
 *              description: Internal server error
 */
productRouter.get('/:productId', productController.getProduct);

/**
 * @swagger
 * /api/product/buy:
 *  put:
 *      tags:
 *      - PRODUCT
 *      description: Buy a product
 *      parameters:
 *          - in: header
 *            name: authorization
 *            schema:
 *              type: string
 *              example: Bearer rh4b5b435njfd
 *          - in: body
 *            name: productId
 *            description: Provide the id of the product you'd like to buy
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: number
 *                  example: 12
 *      responses:
 *          200:
 *              description: Item bought
 *          400:
 *              description: Bad request
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Item not available for buying
 *          404:
 *              description: Item not found
 *          500:
 *              description: Internal server error
 */
productRouter.put('/buy', productController.buyProduct);

/**
 * @swagger
 * /api/product/setstatus:
 *  put:
 *      tags:
 *      - PRODUCT
 *      description: Activate (1) or deactivate (0) a product
 *      parameters:
 *          - in: header
 *            name: authorization
 *            schema:
 *              type: string
 *              example: Bearer rh4b5b435njfd
 *          - in: body
 *            name: statusData
 *            description: Provide the id and status
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: number
 *                  example: 12
 *                statusCode:
 *                  type: number
 *                  example: 0
 *      responses:
 *          200:
 *              description: Status updated
 *          400:
 *              description: productId or statusCode is missing from request body
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden
 *          404:
 *              description: Product not found
 *          500:
 *              description: Internal server error
 */
productRouter.put('/setstatus', productController.setStatus);

export default productRouter;
