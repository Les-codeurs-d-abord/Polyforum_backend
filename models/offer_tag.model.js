module.exports = (sequelize, Sequelize) => {
  const offer_tag = sequelize.define("offer_tag", {
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

  return offer_tag;
};