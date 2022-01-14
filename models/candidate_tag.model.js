module.exports = (sequelize, Sequelize) => {
  const candidate_tag = sequelize.define("candidate_tag", {
    candidateProfileId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'candidate_profiles',
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

  return candidate_tag;
};