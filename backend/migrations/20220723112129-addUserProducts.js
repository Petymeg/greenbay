'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('userProducts', {
    columns: {
      id: {
        type: 'int',
        autoIncrement: true,
        notNull: true,
        primaryKey: true,
        unsigned: true,
      },
      name: { type: 'string', notNull: true },
      description: { type: 'string', notNull: true },
      imgUrl: { type: 'string', notNull: true },
      price: { type: 'int', notNull: true },
      active: { type: 'boolean', notNull: true, defaultValue: true },
      userId: {
        type: 'int',
        notNull: true,
        unsigned: true,
        foreignKey: {
          name: 'userProducts_userId_fk',
          table: 'users',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: {
            userId: 'id',
          },
        },
      },
    },
    ifNotExists: true,
  });
};

exports.down = function (db) {
  return db.dropTable('userProducts');
};

exports._meta = {
  version: 1,
};
