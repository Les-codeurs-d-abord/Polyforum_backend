module.exports = (sequelize, Sequelize) => {
  const company_link = sequelize.define("company_link", {
    label: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  return company_link;
};