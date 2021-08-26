'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Posts', {
            postId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'userId',
                },
                onDelete: 'cascade',
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            postImg: {
                type: Sequelize.STRING
            },
            content: {
                type: Sequelize.STRING(1000)
            },
            maxMember: {
                type: Sequelize.TINYINT.UNSIGNED,
                allowNull: false,
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            endDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            place: {
                type: Sequelize.STRING
            },
            location: {
                type: Sequelize.GEOMETRY('POINT', 4326)
            },
            bring: {
                type: Sequelize.STRING
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
            const TR_Posts_UPDATE_Query = `
                    CREATE TRIGGER TR_Posts_UPDATE
                    AFTER UPDATE ON Posts
                    FOR EACH ROW
                    BEGIN
                        DELETE FROM Tags WHERE postId = old.postId;
                    END `
            queryInterface.sequelize.query(TR_Posts_UPDATE_Query)
        })
            .then(() => {
                const TR_Posts_INSERT_Query = `
                    CREATE TRIGGER TR_Posts_INSERT
                    AFTER INSERT ON Posts
                    FOR EACH ROW
                    BEGIN
                        INSERT INTO Channels (postId, userId) values (new.postId, new.userId);
                    END `
                queryInterface.sequelize.query(TR_Posts_INSERT_Query)
            })
            // .then(() => {
            //     const SE_Set_On_Query = `SET GLOBAL event_scheduler = ON`
            //     queryInterface.sequelize.query(SE_Set_On_Query)
            // })
            .then(() => {
                const ES_DELETE_Posts_endDate_Query = `
                    CREATE EVENT ES_DELETE_Posts_endDate
                        ON SCHEDULE EVERY 1 HOUR
                        STARTS '2021-01-01 00:00:00'
                    DO
                        DELETE FROM FinalProject.Posts WHERE endDate <= NOW()`
                queryInterface.sequelize.query(ES_DELETE_Posts_endDate_Query)
            })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Posts');
    }
};