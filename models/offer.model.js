module.exports = (sequelize, Sequelize) => {
  const Offer = sequelize.define("offer", {
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
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
    companyId: {
      type: Sequelize.INTEGER
    }
  });

  return Offer;
};