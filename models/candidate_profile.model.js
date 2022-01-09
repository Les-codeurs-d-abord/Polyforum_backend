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
    linkedinLink: {
      type: Sequelize.TEXT,
    }, 
    logo: {
      type: Sequelize.BLOB('long'),
    }
  });

  return CandidateProfile;
};