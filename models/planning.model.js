module.exports = (sequelize, Sequelize) => {
    const Planning = sequelize.define("planning", {

        userPlanning: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'users',
                key: 'id',
            }
        },
    });

    return Planning;

};