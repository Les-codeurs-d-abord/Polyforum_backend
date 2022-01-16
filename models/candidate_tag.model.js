module.exports = (sequelize, Sequelize) => {
  const candidate_tag = sequelize.define("candidate_tag", {
    candidateProfileId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'candidate_profiles',
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

  return candidate_tag;
};