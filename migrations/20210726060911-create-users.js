'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            userId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            nickname: {
                type: Sequelize.STRING(50),
                unique: true,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            profileImg: {
                type: Sequelize.STRING
            },
            statusMessage: {
                type: Sequelize.STRING,
            },
            rating: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: '70'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')
            }
        }).then(() => {
            const TR_Users_Query = `
                CREATE TRIGGER TR_Users
                AFTER UPDATE ON Users
                FOR EACH ROW
                BEGIN
                    DELETE FROM Likes WHERE userId = old.userId;
                END `
            queryInterface.sequelize.query(TR_Users_Query)
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    }
};