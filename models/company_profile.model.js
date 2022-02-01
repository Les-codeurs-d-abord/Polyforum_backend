module.exports = (sequelize, Sequelize) => {
  const CompanyProfile = sequelize.define("company_profile", {
    companyName: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    },
    phoneNumber: {
      type: Sequelize.STRING(255),
    },
    description: {
      type: Sequelize.TEXT,
    },
    logo: {
      type: Sequelize.STRING(255),
    },
    status: {
      type: Sequelize.ENUM('Jamais connecté', 'Incomplet', 'Complet'),
      allowNull: false,
      validate: {
        isIn: [['Jamais connecté', 'Incomplet', 'Complet']]
      }
    }
  });

  return CompanyProfile;
};