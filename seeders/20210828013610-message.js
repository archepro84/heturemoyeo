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
        await queryInterface.bulkInsert('Messages', [
            {
                postId: 1,
                userId: 1,
                message: "Hello"
            },
            {
                postId: 1,
                userId: 2,
                message: "Hello"
            },
            {
                postId: 1,
                userId: 1,
                message: "Who Are You??"
            },
            {
                postId: 1,
                userId: 3,
                message: "Hello"
            },
            {
                postId: 1,
                userId: 1,
                message: "Hello"
            },
            {
                postId: 1,
                userId: 2,
                message: "Watson"
            },
            {
                postId: 1,
                userId: 1,
                message: "Where ?"
            },
            {
                postId: 1,
                userId: 2,
                message: "um....."
            },
            {
                postId: 1,
                userId: 1,
                message: "Jun"
            },
            {
                postId: 1,
                userId: 3,
                message: "Sung"
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
        await queryInterface.bulkDelete('Messages', null, {});
    }
};
