'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Messages extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Messages.init({
        messageId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            required: true,
        },
        postId: {
            type: DataTypes.INTEGER,
            required: true
        },
        userId: {
            type: DataTypes.INTEGER,
        },
        message: {
            type: DataTypes.STRING,
            required: true
        }
    }, {
        sequelize,
        modelName: 'Messages',
    });
    Messages.associate = function (models) {
        models.Messages.hasMany(models.Posts, {
            foreignKey: 'postId',
            onDelete: 'cascade',
        })
        models.Messages.hasMany(models.Channels, {
            foreignKey: 'userId',
            onDelete: 'set null',
        })
    }
    return Messages;
};