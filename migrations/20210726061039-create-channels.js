'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Channels', {
            channelId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            postId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Posts',
                    key: 'postId',
                },
                onDelete: 'cascade',
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'userId',
                },
                onDelete: 'cascade'
            },
            confirm: {
                type: Sequelize.TINYINT.UNSIGNED,
                allowNull: false,
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
            const POSTS_VW_Query = `
                CREATE VIEW POSTS_VW
                AS
                    SELECT p.postId, p.userId, p.title, p.postImg, 
                        (SELECT COUNT(confirm) FROM Channels WHERE postId = p.postId AND confirm = 1) AS confirmCount,
                        COUNT(*) AS currentMember, p.maxMember, p.startDate, p.endDate, p.place,
                        (SELECT GROUP_CONCAT(tag ORDER BY tag ASC SEPARATOR ', ') FROM Tags WHERE postId = p.postId GROUP BY postId) AS tagItem
                    FROM Channels  AS c
                    JOIN Posts AS p
                    ON p.postId = c.postId
                    GROUP BY c.postId `
            queryInterface.sequelize.query(POSTS_VW_Query)
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Channels');
    }
};