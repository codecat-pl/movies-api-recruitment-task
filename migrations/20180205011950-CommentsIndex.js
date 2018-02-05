'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};


exports.up = function (db, callback) {
    db.addIndex('comments', 'movie_index', 'movie', false, callback);
};

exports.down = function (db, callback) {
    db.removeIndex('comments', 'movie_index', callback);
};


exports._meta = {
  "version": 1
};
