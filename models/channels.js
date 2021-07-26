'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Channels extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Channels.init({
        channelId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            require: true,
        },
        postId: {
            type: DataTypes.INTEGER,
            required: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            required: true,
        }
    }, {
        sequelize,
        modelName: 'Channels',
    });
    Channels.associate = function (models) {
        models.Channels.hasMany(models.Posts, {
            foreignKey: 'postId',
            onDelete: 'cascade',
        })
        models.Channels.hasMany(models.Users, {
            foreignKey: 'userId',
            onDelete: 'cascade',
        })
    }

    return Channels;
};