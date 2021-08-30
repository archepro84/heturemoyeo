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
        await queryInterface.bulkInsert('Posts', [
            {
                userId: 1,
                title: "Title Hello",
                postImg: null,
                content: "content",
                maxMember: 5,
                startDate: new Date(),
                endDate: new Date(),
                place: "Daegue",
                bring: "No!"
            },
            {
                userId: 1,
                title: "Board Game Group",
                postImg: null,
                content: "Like BoardGame",
                maxMember: 3,
                startDate: new Date(),
                endDate: new Date(),
                place: "seoul",
                bring: "30$"
            },
            {
                userId: 2,
                title: "GG!",
                postImg: null,
                content: "GG!",
                maxMember: 10,
                startDate: new Date(),
                endDate: new Date(),
                place: "online",
                bring: "No"
            },
            {
                userId: 2,
                title: "HighSchool Meeting!",
                postImg: null,
                content: "GG!",
                maxMember: 2,
                startDate: new Date(),
                endDate: new Date(),
                place: "HighSchool",
                bring: "No"
            },
            {
                userId: 3,
                title: "MiddleSchool Meeting!",
                postImg: null,
                content: "!MSM!",
                maxMember: 2,
                startDate: new Date(),
                endDate: new Date(),
                place: "MiddleschoolMeeting",
                bring: "No"
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
        await queryInterface.bulkDelete('Posts', null, {});
    }
};
