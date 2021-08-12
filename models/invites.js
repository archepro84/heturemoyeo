'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Invites extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Invites.init({
        inviteId: {
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
        },
        postId: {
            type: DataTypes.INTEGER,
            required: true
        },
    }, {
        sequelize,
        modelName: 'Invites',
    });
    Invites.associate = function (models) {
        models.Invites.hasMany(models.Users, {
            foreignKey: 'userId',
            onDelete: 'cascade',
        })
        models.Tags.hasMany(models.Posts, {
            foreignKey: 'postId',
            onDelete: 'cascade',
        })
    }

    return Invites;
};