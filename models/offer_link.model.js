module.exports = (sequelize, Sequelize) => {
  const offer_link = sequelize.define("offer_link", {
    label: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  return offer_link;
};