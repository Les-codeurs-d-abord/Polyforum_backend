module.exports = (sequelize, Sequelize) => {
  const offer_tag = sequelize.define("offer_tag", {
    offerId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'offers',
        key: 'id',
      }
    },
    tagId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'tags',
        key: 'id',
      }
    }
  });

  return offer_tag;
};