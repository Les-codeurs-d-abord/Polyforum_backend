module.exports = (sequelize, Sequelize) => {
  const tag = sequelize.define("tag", {
    label: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    }
  });

  return tag;
};