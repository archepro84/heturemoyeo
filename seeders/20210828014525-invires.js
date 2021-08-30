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
        await queryInterface.bulkInsert('Invites', [
            {
                giveUserId: 1,
                receiveUserId: 5,
                postId: 2
            },
            {
                giveUserId: 1,
                receiveUserId: 6,
                postId: 2
            },
            {
                giveUserId: 1,
                receiveUserId: 7,
                postId: 2
            },
            {
                giveUserId: 2,
                receiveUserId: 1,
                postId: 3
            },
            {
                giveUserId: 2,
                receiveUserId: 3,
                postId: 3
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
        await queryInterface.bulkDelete('Invites', null, {});
    }
};
