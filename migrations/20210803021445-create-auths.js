'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Auths', {
            authId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            authData: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            isAuth: {
                type: Sequelize.TINYINT.UNSIGNED,
                allowNull: false,
                defaultValue: '0'
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
            const SP_Auths_INSERT_QUERY = `
                CREATE PROCEDURE SP_Auths_INSERT
                (
                 IN auth_email varchar(255),
                 IN auth_authData varchar(255) 
                )
                BEGIN
                    IF EXISTS (SELECT email FROM Auths WHERE email = auth_email) THEN
                        UPDATE Auths SET authData = auth_authData, updatedAt = NOW()
                        WHERE email = auth_email;
                    ELSE 
                        INSERT INTO Auths (email, authData) VALUES (auth_email, auth_authData);
                    END IF;
                    
                END`
            queryInterface.sequelize.query(SP_Auths_INSERT_QUERY)
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Auths');
    }
};