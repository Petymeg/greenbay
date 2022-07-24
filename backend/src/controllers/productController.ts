import { NextFunction, Request, Response } from 'express';
import { AddUserProductRequestViewModel } from '../models/view/AddUserProductRequestViewModel';
import { AddUserProductViewModel } from '../models/view/AddUserProductViewModel';
import { DeleteUserProductRequestViewModel } from '../models/view/DeleteUserProductRequestViewModel';
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
  async deleteProduct(
    req: Request<DeleteUserProductRequestViewModel>,
    res: Response,
    next: NextFunction
  ) {
    const { productId } = req.params;

    if (!productId) return next(badRequestError('productId is missing!'));

    const token = jwtService.getTokenFromRequest(req);
    const { userId } = jwtService.getTokenPayload(token);

    try {
      const result = await productService.deleteProduct(productId, userId);
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  },
};
