module.exports = (sequelize, Sequelize) => {
    const wish_company = sequelize.define("wish_company", {
        companyId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'company_profiles',
                key: 'id',
            }
        },
        candidateId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'candidate_profiles',
                key: 'id',
            }
        },
        rank: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    });
  
    return wish_company;
  };