import { NextFunction, Request, Response } from 'express';
import { ProductStatusViewModel } from '../models/common/ProductStatusViewModel';
import { ProductStatusTypes } from '../models/enums/ProductStatusTypes';
import { AddUserProductRequestViewModel } from '../models/view/AddUserProductRequestViewModel';
import { AddUserProductViewModel } from '../models/view/AddUserProductViewModel';
import { BuyProductRequestViewModel } from '../models/view/BuyProductRequestViewModel';
import { EditProductRequestViewModel } from '../models/view/EditProductRequestViewModel';
import { ProductStatusRequestViewModel } from '../models/view/ProductStatusRequestViewModel';
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
  async setStatus(
    req: Request<ProductStatusRequestViewModel>,
    res: Response<ProductStatusViewModel>,
    next: NextFunction
  ) {
    const { productId, statusCode } = req.body;

    if (!productId || statusCode === undefined)
      return next(badRequestError('productId and statusCode are mandatory!'));

    if (!(statusCode in ProductStatusTypes))
      return next(badRequestError('Invalid statusCode!'));

    const token = jwtService.getTokenFromRequest(req);
    const { userId } = jwtService.getTokenPayload(token);

    const statusDetails = {
      userId,
      productId,
      statusCode,
    };

    try {
      await productService.setStatus(statusDetails);
      res.status(200).send({ statusCode });
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

    if (isNaN(+productId))
      return next(badRequestError('productId needs to be a number!'));

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
    const { productId, name, description, imgUrl, price } = req.body;

    if (!productId || !name || !description || !imgUrl || !price) {
      return next(
        badRequestError(
          'ProductId, name, description, imgUrl and price are all mandatory. The price cannot be 0.'
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
