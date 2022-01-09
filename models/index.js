const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

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

// Entities
db.users = require("./user.model.js")(sequelize, Sequelize);
db.company_profiles = require("./company_profile.model.js")(sequelize, Sequelize);
db.candidate_profiles = require("./candidate_profile.model.js")(sequelize, Sequelize);
db.offers = require("./offer.model.js")(sequelize, Sequelize);
db.tags = require("./tag.model.js")(sequelize, Sequelize);
db.offer_tags = require("./offer_tag.model.js")(sequelize, Sequelize);
db.offer_links = require("./offer_link.model.js")(sequelize, Sequelize);
db.candidate_links = require("./candidate_link.model.js")(sequelize, Sequelize);
db.company_links = require("./company_link.model.js")(sequelize, Sequelize);


// Relations / Associations
db.company_profiles.belongsTo(db.users);
db.company_profiles.hasMany(db.company_links);
db.company_links.belongsTo(db.company_profiles);

db.candidate_profiles.belongsTo(db.users);
db.candidate_profiles.hasMany(db.candidate_links);
db.candidate_links.belongsTo(db.candidate_profiles);

db.offers.hasMany(db.offer_tags, { foreignKey: 'offerId' });
db.offer_tags.belongsTo(db.offers, { foreignKey: 'offerId' });

db.offers.hasMany(db.offer_links);
db.offer_links.belongsTo(db.offers);


db.tags.hasMany(db.offer_tags);
db.offer_tags.belongsTo(db.tags);


module.exports = db;