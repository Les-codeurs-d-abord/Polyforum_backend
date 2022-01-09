module.exports = (sequelize, Sequelize) => {
  const candidate_link = sequelize.define("candidate_link", {
    label: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  return candidate_link;
};