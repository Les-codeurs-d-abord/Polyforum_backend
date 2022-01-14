module.exports = (sequelize, Sequelize) => {
    const wish_candidate = sequelize.define("wish_candidate", {
      candidateId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'candidate_profiles',
          key: 'id',
        }
      }, 
      offerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'offers',
          key: 'id',
        }
      },
      rank: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
  });
    return wish_candidate;
  };