'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */
        await queryInterface.bulkInsert('Likes', [
            {
                userId: 1,
                likeItem: "Game"
            },
            {
                userId: 1,
                likeItem: "EDM"
            },
            {
                userId: 1,
                likeItem: "Travel"
            },
            {
                userId: 2,
                likeItem: "Game"
            },
            {
                userId: 2,
                likeItem: "Music"
            },
            {
                userId: 3,
                likeItem: "Board"
            },
            {
                userId: 4,
                likeItem: "Board"
            },
            {
                userId: 4,
                likeItem: "Game"
            },
            {
                userId: 4,
                likeItem: "walking"
            },
        ]
        )
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Likes', null, {});
    }
};
