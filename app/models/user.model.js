module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    firstName: {
      type: Sequelize.STRING(255)
    },
    lastName: {
      type: Sequelize.STRING(255)
    },
    age: {
      type: Sequelize.INTEGER,
      validate: {
        min: 0,
      }
    },
    role: {
      type: Sequelize.ENUM('ADMIN', 'CANDIDAT', 'ENTREPRISE'),
      allowNull: false,
      validate: {
        isIn: [['ADMIN', 'CANDIDAT', 'ENTREPRISE']]
      }
    }
  });

  return User;
};