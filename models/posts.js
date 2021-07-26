'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Posts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Posts.init({
        postId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            required: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            required: true,
        },
        title: {
            type: DataTypes.STRING,
            required: true,
        },
        postImg: {
            type: DataTypes.STRING,
        },
        content: {
            type: DataTypes.STRING(1000),
        },
        maxMember: {
            type: DataTypes.TINYINT.UNSIGNED,
            required: true,
        },
        startDate: {
            type: DataTypes.DATE,
            required: true,
        },
        endDate: {
            type: DataTypes.DATE,
            required: true,
        },
        place: {
            type: DataTypes.STRING,
        },
        bring: {
            type: DataTypes.STRING,
        },
        public: {
            type: DataTypes.TINYINT.UNSIGNED,
            required: true,
        },
    }, {
        sequelize,
        modelName: 'Posts',
    });

    Posts.associate = function (models) {
        models.Posts.hasMany(models.Users, {
            foreignKey: 'userId',
            onDelete: 'cascade',
        })
    }
    return Posts;
};