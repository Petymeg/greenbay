import { OkPacket } from 'mysql';
import { db } from '../data/connection';
import { AddProductRequestModel } from '../models/common/AddProductRequestModel';

export const productRepository = {
  async addNewProduct(productDetails: AddProductRequestModel): Promise<number> {
    const { name, description, imgUrl, price, userId } = productDetails;

    const query = `INSERT INTO
                        userProducts
                        (name, description, imgUrl, price, userId)
                    VALUES
                        (?, ?, ?, ?, ?)`;

    const result = await db.query<OkPacket>(query, [
      name,
      description,
      imgUrl,
      `${price}`,
      `${userId}`,
    ]);

    return result.insertId;
  },
};
