'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Likes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Likes.init({
        likeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            required: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            required: true,
        },
        likeItem: {
            type: DataTypes.STRING,
            required: true,
        }
    }, {
        sequelize,
        modelName: 'Likes',
    });

    Likes.associate = function (models) {
        models.Likes.hasMany(models.Users, {
            foreignKey: 'userId',
            onDelete: 'cascade',
        })
    }

    return Likes;
};