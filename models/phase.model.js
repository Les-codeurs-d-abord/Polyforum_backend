module.exports = (sequelize, Sequelize) => {
  const Phase = sequelize.define("phase", {
    currentPhase: {
      type: Sequelize.ENUM('INSCRIPTION', 'VOEUX', 'PLANNING'),
      allowNull: false,
      validate: {
        isIn: [['INSCRIPTION', 'VOEUX', 'PLANNING']]
      }
    }
  });

  return Phase;
};