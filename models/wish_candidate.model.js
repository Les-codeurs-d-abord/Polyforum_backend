module.exports = (sequelize, Sequelize) => {
    const wish_candidate = sequelize.define("wish_candidate", {
      rank: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
  });
    return wish_candidate;
  };