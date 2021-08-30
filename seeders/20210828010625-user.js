'use strict';
const crypto = require("crypto");

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
        await queryInterface.bulkInsert('Users', [
            {
                phone: "01011111111",
                name: "Chris John",
                nickname: "KKK",
                password: crypto.createHash('sha512').update('!@#4qwer').digest('base64'),
                profileImg: null,
                statusMessage: null,
            },
            {
                phone: "01022222222",
                name: "Riot",
                nickname: "Riot",
                password: crypto.createHash('sha512').update('!@#4qwer').digest('base64'),
                profileImg: null,
                statusMessage: null,
            },
            {
                phone: "01033333333",
                name: "karis",
                nickname: "karis",
                password: crypto.createHash('sha512').update('!@#4qwer').digest('base64'),
                profileImg: null,
                statusMessage: null,
            },
            {
                phone: "01044444444",
                name: "Zero",
                nickname: "Zero",
                password: crypto.createHash('sha512').update('!@#4qwer').digest('base64'),
                profileImg: null,
                statusMessage: null,
            },
            {
                phone: "01055555555",
                name: "Metro",
                nickname: "Metro",
                password: crypto.createHash('sha512').update('!@#4qwer').digest('base64'),
                profileImg: null,
                statusMessage: null,
            },
            {
                phone: "01066666666",
                name: "qqwwee",
                nickname: "qqwwee",
                password: crypto.createHash('sha512').update('!@#4qwer').digest('base64'),
                profileImg: null,
                statusMessage: null,
            },
            {
                phone: "01077777777",
                name: "qqwwe",
                nickname: "qqwwe",
                password: crypto.createHash('sha512').update('!@#4qwer').digest('base64'),
                profileImg: null,
                statusMessage: null,
            },
            {
                phone: "01088888888",
                name: "newhi",
                nickname: "newhi",
                password: crypto.createHash('sha512').update('!@#4qwer').digest('base64'),
                profileImg: null,
                statusMessage: null,
            },
            {
                phone: "01099999999",
                name: "newhihi",
                nickname: "newhihi",
                password: crypto.createHash('sha512').update('!@#4qwer').digest('base64'),
                profileImg: null,
                statusMessage: null,
            },
            {
                phone: "01049119038",
                name: "YoungWoo",
                nickname: "YoungWoo",
                password: crypto.createHash('sha512').update('!@#4qwer').digest('base64'),
                profileImg: null,
                statusMessage: null,
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
        await queryInterface.bulkDelete('Users', null, {});
    }
};
