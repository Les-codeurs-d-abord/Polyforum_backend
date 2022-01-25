module.exports = (sequelize, Sequelize) => {
    const wish_company = sequelize.define("wish_company", {
        rank: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    });
  
    return wish_company;
  };