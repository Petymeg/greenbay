import { OkPacket } from 'mysql';
import { db } from '../data/connection';
import { UserDomainModel } from '../models/domain/UserDomainModel';

export const userRepository = {
  async getUsers(): Promise<UserDomainModel[]> {
    const query = `SELECT
                        *
                    FROM
                        users`;

    return await db.query<UserDomainModel[]>(query);
  },
  async createInitialUserIfDbIsEmpty(): Promise<void> {
    const dbUsers = await userRepository.getUsers();
    if (dbUsers.length > 0) return console.log('Users table is populated');

    const query = `INSERT INTO
                    users
                    (name, password, roleId)
                    VALUES
                    ('Admin', 'VerySecretPassword', 1),
                    ('Juan', 'akldfjalkjsdf', 2),
                    ('Miguel', '3b56645zb', 2),
                    ('Marco', 'wbe652', 2);
    
    `;

    await db.query(query);

    return console.log('Users table was empty, base users added');
  },
  async getUserByName(username: string): Promise<UserDomainModel> {
    const query = `SELECT
                    *
                  FROM
                    users
                  WHERE
                    name = ?`;

    const userList = await db.query<UserDomainModel[]>(query, [username]);

    return userList[0];
  },
  async register(username: string, password: string): Promise<number> {
    const query = `INSERT INTO
                    users
                    (name, password)
                  VALUES
                    (?, ?);
                  `;

    const result = await db.query<OkPacket>(query, [username, password]);

    return result.insertId;
  },
};
