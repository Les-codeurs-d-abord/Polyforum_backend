const offer_tag = require("./user.model.js");

module.exports = (sequelize, Sequelize) => {
  const Offer = sequelize.define("offer", {
    companyName: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    icon: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    companyId: {
      type: Sequelize.INTEGER
    }
  });

  return Offer;
};