import { OkPacket } from 'mysql';
import { db } from '../data/connection';
import { AddUserProductRequestModel } from '../models/common/AddUserProductRequestModel';
import { ProductWithOwnerDomainModel } from '../models/domain/ProductWithOwnerDomainModel';
import { UserProductDomainModel } from '../models/domain/UserProductDomainModel';
import { ProductStatusTypes } from '../models/enums/ProductStatusTypes';

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

  async setStatusById(productId: number, statusCode: number): Promise<void> {
    const query = `UPDATE
                      userProducts
                    SET                      
                      status = ?
                    WHERE
                      id = ?;`;

    await db.query(query, [`${statusCode}`, `${productId}`]);
  },

  async getSellableProducts(): Promise<ProductWithOwnerDomainModel[]> {
    const query = `SELECT
                      *, p.id as id, p.name as name, u.id as userId, u.name as userName
                    FROM
                      userProducts p
                    JOIN
                      users u
                    ON
                      p.userId = u.id
                    WHERE
                      status = ?`;

    return db.query<ProductWithOwnerDomainModel[]>(query, [
      `${ProductStatusTypes.Active}`,
    ]);
  },

  async getProductWithOwnerById(
    productId: number
  ): Promise<ProductWithOwnerDomainModel> {
    const query = `SELECT
                    *, p.id as id, p.name as name, u.id as userId, u.name as userName
                    FROM
                      userProducts p
                    JOIN
                      users u
                    ON
                      p.userId = u.id
                    WHERE
                      p.id = ?;`;

    const productDetails = await db.query<ProductWithOwnerDomainModel[]>(
      query,
      [`${productId}`]
    );

    return productDetails[0];
  },

  async editProductById(
    productId: number,
    name: string,
    description: string,
    imgUrl: string,
    price: number
  ): Promise<void> {
    const query = `UPDATE 
                    userProducts
                  SET
                    name = ?, 
                    description = ?, 
                    imgUrl = ?, 
                    price = ?
                  WHERE
                    id = ?`;

    await db.query(query, [
      name,
      description,
      imgUrl,
      `${price}`,
      `${productId}`,
    ]);
  },

  getProductsByUserId(userId: number): Promise<UserProductDomainModel[]> {
    const query = `SELECT
                    *
                  FROM
                    userProducts
                  WHERE
                    userId = ?;`;

    return db.query<UserProductDomainModel[]>(query, [`${userId}`]);
  },
};
