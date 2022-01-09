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

// Relations / Associations
db.company_profiles.belongsTo(db.users);
db.candidate_profiles.belongsTo(db.users);


module.exports = db;
