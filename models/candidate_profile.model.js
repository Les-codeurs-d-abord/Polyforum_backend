module.exports = (sequelize, Sequelize) => {
  const CandidateProfile = sequelize.define("candidate_profile", {
    lastName: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    phoneNumber: {
      type: Sequelize.STRING(255),
      validate: {
        notEmpty: true
      }
    },
    address: {
      type: Sequelize.TEXT,
    },
    description: {
      type: Sequelize.TEXT,
    },
    logo: {
      type: Sequelize.STRING(255),
    },
    cv: {
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

  return CandidateProfile;
};