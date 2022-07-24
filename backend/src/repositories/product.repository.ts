import { OkPacket } from 'mysql';
import { db } from '../data/connection';
import { AddUserProductRequestModel } from '../models/common/AddUserProductRequestModel';

export const productRepository = {
  async addNewProduct(
    productDetails: AddUserProductRequestModel
  ): Promise<number> {
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
