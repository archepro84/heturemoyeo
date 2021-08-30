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
        await queryInterface.bulkInsert('Channels', [
            {
                postId: 1,
                userId: 2
            },
            {
                postId: 1,
                userId: 3
            },
            {
                postId: 2,
                userId: 2
            },
            {
                postId: 2,
                userId: 3
            },
            {
                postId: 2,
                userId: 6
            },
            {
                postId: 3,
                userId: 3
            },
            {
                postId: 1,
                userId: 5
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
        await queryInterface.bulkDelete('Channels', null, {});
    }
};
