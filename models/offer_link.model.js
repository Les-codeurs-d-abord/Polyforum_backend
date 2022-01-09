module.exports = (sequelize, Sequelize) => {
  const offer_link = sequelize.define("offer_link", {
    offerId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'offers',
        key: 'id',
      }
    },
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