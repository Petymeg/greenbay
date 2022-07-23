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
    if (dbUsers.length > 0)
      return console.log('Users table is already populated');

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

    return console.log('Base users created');
  },
};
