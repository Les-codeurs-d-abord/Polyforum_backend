module.exports = (sequelize, Sequelize) => {
  const link = sequelize.define("link", {
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

  return link;
};