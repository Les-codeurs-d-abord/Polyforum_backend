const offer_tag = require("./user.model.js");

module.exports = (sequelize, Sequelize) => {
  const Offer = sequelize.define("offer", {
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    offerFile: {
      type: Sequelize.STRING(255),
    },
    phoneNumber: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    address: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  return Offer;
};
