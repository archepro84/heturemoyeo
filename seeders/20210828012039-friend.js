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
        await queryInterface.bulkInsert('Friends', [
            {
                giveUserId: 1,
                receiveUserId: 2
            },
            {
                giveUserId: 1,
                receiveUserId: 3
            },
            {
                giveUserId: 2,
                receiveUserId: 3
            },
            {
                giveUserId: 3,
                receiveUserId: 1
            },
            {
                giveUserId: 2,
                receiveUserId: 1
            },
            {
                giveUserId: 4,
                receiveUserId: 1
            }, {
                giveUserId: 5,
                receiveUserId: 1
            },
            {
                giveUserId: 1,
                receiveUserId: 4
            },
            {
                giveUserId: 1,
                receiveUserId: 5
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
        await queryInterface.bulkDelete('Friends', null, {});
    }
};
