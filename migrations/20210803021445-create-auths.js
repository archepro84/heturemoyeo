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
            phone: {
                type: Sequelize.STRING(100),
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
                 IN auth_phone varchar(100),
                 IN auth_authData varchar(255) 
                )
                BEGIN
                    IF EXISTS (SELECT phone FROM Auths WHERE phone = auth_phone) THEN
                        UPDATE Auths SET authData = auth_authData, updatedAt = NOW()
                        WHERE phone = auth_phone;
                    ELSE 
                        INSERT INTO Auths (phone, authData) VALUES (auth_phone, auth_authData);
                    END IF;
                    
                END`
            queryInterface.sequelize.query(SP_Auths_INSERT_QUERY)
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Auths');
    }
};