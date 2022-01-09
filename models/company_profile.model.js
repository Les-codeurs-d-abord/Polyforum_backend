module.exports = (sequelize, Sequelize) => {
  const CompanyProfile = sequelize.define("company_profile", {
    companyName: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    },
    telephone: {
      type: Sequelize.STRING(255),
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: Sequelize.TEXT,
    },
    linkedinLink: {
      type: Sequelize.TEXT,
    }, 
    logo: {
      type: Sequelize.BLOB('long'),
    }
  });

  return CompanyProfile;
};