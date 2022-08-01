import { NextFunction, Request, Response } from 'express';
import { AddUserProductRequestViewModel } from '../models/view/AddUserProductRequestViewModel';
import { AddUserProductViewModel } from '../models/view/AddUserProductViewModel';
import { BuyProductRequestViewModel } from '../models/view/BuyProductRequestViewModel';
import { DeleteUserProductRequestViewModel } from '../models/view/DeleteUserProductRequestViewModel';
import { EditProductRequestViewModel } from '../models/view/EditProductRequestViewModel';
import { ProductWithOwnerViewModel } from '../models/view/ProductWithOwnerViewModel';
import { badRequestError } from '../services/generalErrorService';
import { jwtService } from '../services/JwtService';
import { productService } from '../services/productService';

export const productController = {
  async addUserProduct(
    req: Request<AddUserProductRequestViewModel>,
    res: Response<AddUserProductViewModel>,
    next: NextFunction
  ) {
    const { name, description, imgUrl, price } = req.body;

    if (!name || !description || !imgUrl || !price) {
      return next(
        badRequestError(
          'name, description, image URL and price are all required!'
        )
      );
    }

    const token = jwtService.getTokenFromRequest(req);
    const { userId } = jwtService.getTokenPayload(token);

    const productDetails = {
      name,
      description,
      imgUrl,
      price,
      userId,
    };

    try {
      const productId = await productService.addUserProduct(productDetails);
      res.status(201).send({ productId });
    } catch (err) {
      next(err);
    }
  },
  async delistProduct(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params;

    if (!productId) return next(badRequestError('productId is missing!'));

    const token = jwtService.getTokenFromRequest(req);
    const { userId } = jwtService.getTokenPayload(token);

    try {
      const result = await productService.delistProduct(+productId, userId);
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  },

  async getSellableProducts(
    req: Request,
    res: Response<ProductWithOwnerViewModel[]>,
    next: NextFunction
  ) {
    try {
      const sellableProducts = await productService.getSellableProducts();

      res.status(200).send(sellableProducts);
    } catch (err) {
      next(err);
    }
  },

  async getProduct(
    req: Request,
    res: Response<ProductWithOwnerViewModel>,
    next: NextFunction
  ) {
    const { productId } = req.params;

    if (!productId) return next(badRequestError('productId is missing!'));

    try {
      const result = await productService.getProductById(+productId);
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  },

  async buyProduct(
    req: Request<BuyProductRequestViewModel>,
    res: Response,
    next: NextFunction
  ) {
    const { productId } = req.body;

    if (!productId) {
      return next(badRequestError('Please provide a productId'));
    }

    const token = jwtService.getTokenFromRequest(req);
    const { userId } = jwtService.getTokenPayload(token);

    try {
      await productService.buyProduct(+productId, userId);
      res.status(200).send();
    } catch (err) {
      next(err);
    }
  },

  async editProduct(
    req: Request<EditProductRequestViewModel>,
    res: Response,
    next: NextFunction
  ) {
    const { name, description, imgUrl, price } = req.body;
    const { productId } = req.params;

    if (!name || !description || !imgUrl || !price) {
      return next(
        badRequestError(
          'Name, description, imgUrl and price are all mandatory. The price cannot be 0.'
        )
      );
    }

    const token = jwtService.getTokenFromRequest(req);
    const { userId } = jwtService.getTokenPayload(token);

    const requestData = {
      productId,
      name,
      description,
      imgUrl,
      price,
      userId,
    };

    try {
      await productService.editProduct(requestData);
      res.status(200).send();
    } catch (err) {
      next(err);
    }
  },
};
