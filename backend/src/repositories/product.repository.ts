import { OkPacket } from 'mysql';
import { db } from '../data/connection';
import { AddUserProductRequestModel } from '../models/common/AddUserProductRequestModel';
import { UserProductDomainModel } from '../models/domain/UserProductDomainModel';

export const productRepository = {
  async addUserProduct(
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

  async getProductById(productId: number): Promise<UserProductDomainModel> {
    const query = `SELECT
                        *
                    FROM
                        userProducts
                    WHERE
                        id = ?;`;

    const productDetails = await db.query<UserProductDomainModel[]>(query, [
      `${productId}`,
    ]);

    return productDetails[0];
  },

  async deleteProductById(productId: number): Promise<void> {
    const query = `DELETE FROM
                        userProducts
                    WHERE
                        id = ?;`;

    await db.query(query, [`${productId}`]);
  },
};
