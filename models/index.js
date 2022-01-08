const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.offers = require("./offer.model.js")(sequelize, Sequelize);
db.tags = require("./tag.model.js")(sequelize, Sequelize);
db.offer_tags = require("./offer_tag.model.js")(sequelize, Sequelize);

// db.offers.belongsToMany(db.offer_tags, { through: 'Tags' });
// db.offer_tags.belongsToMany(db.tags, { through: 'Tags' });

db.offers.hasMany(db.offer_tags);
db.offer_tags.belongsTo(db.offers);

db.tags.hasMany(db.offer_tags);
db.offer_tags.belongsTo(db.tags);

module.exports = db;
