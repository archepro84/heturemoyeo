'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Friends extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Friends.init({
        friendId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            required: true,
        },
        giveUserId: {
            type: DataTypes.INTEGER,
            required: true,
        },
        receiveUserId: {
            type: DataTypes.INTEGER,
            required: true,
        }
    }, {
        sequelize,
        modelName: 'Friends',
    });
    Friends.associate = function (models) {
        models.Friends.hasMany(models.Users, {
            foreignKey: 'userId',
            onDelete: 'cascade',
        })
    }
    return Friends;
};