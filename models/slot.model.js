module.exports = (sequelize, Sequelize) => {
    const Slot = sequelize.define("slot", {
        userPlanning: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            }
        },
      
        userMet: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            }
        },

      companyName: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      candidateName: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      
      logo: {
        type: Sequelize.STRING(255),
      },

      period: {
        type: Sequelize.ENUM('14h - 14h30', '14h30 - 15h', '15h - 15h30', '15h30 - 16h', '16h - 16h30', '16h30 - 17h', '17h - 17h30', '17h30 - 18h'),
        allowNull: false,
        validate: {
          isIn: [['14h - 14h30', '14h30 - 15h', '15h - 15h30', '15h30 - 16h', '16h - 16h30', '16h30 - 17h', '17h - 17h30', '17h30 - 18h']]
        }
      }
    });

  
    return Slot;
  };