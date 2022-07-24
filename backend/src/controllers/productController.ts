import { NextFunction, Request, Response } from 'express';
import { AddUserProductRequestViewModel } from '../models/view/AddUserProductRequestViewModel';
import { AddUserProductViewModel } from '../models/view/AddUserProductViewModel';
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

    if (!name || !description || !imgUrl || price) {
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
};
