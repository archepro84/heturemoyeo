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
        await queryInterface.bulkInsert('Tags', [
            {
                postId: 1,
                tag: "Hello"
            },
            {
                postId: 1,
                tag: "No"
            },
            {
                postId: 1,
                tag: "Play"
            },
            {
                postId: 2,
                tag: "Game"
            },
            {
                postId: 3,
                tag: "Board"
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
        await queryInterface.bulkDelete('Tags', null, {});
    }
};
