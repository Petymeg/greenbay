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
  return db.createTable('users', {
    columns: {
      id: {
        type: 'int',
        autoIncrement: true,
        notNull: true,
        primaryKey: true,
        unsigned: true,
      },
      name: { type: 'string', notNull: true },
      password: { type: 'string', notNull: true },
      roleId: {
        type: 'int',
        notNull: true,
        defaultValue: 2,
        unsigned: true,
        foreignKey: {
          name: 'users_roleId_fk',
          table: 'roleTypes',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: {
            roleId: 'id',
          },
        },
      },
      money: { type: 'int', notNull: true, defaultValue: 0, unsigned: true },
    },
    ifNotExists: true,
  });
};

exports.down = function (db) {
  return db.dropTable('users');
};

exports._meta = {
  version: 1,
};
