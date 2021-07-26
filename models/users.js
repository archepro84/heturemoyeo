'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Users.init({
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            required: true,
        },
        email: {
            type: DataTypes.STRING,
            required: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING(50),
            required: true,
        },
        nickname: {
            type: DataTypes.STRING(50),
            required: true,
        },
        password: {
            type: DataTypes.STRING,
            required: true,
        },
        profileImg: {
            type: DataTypes.STRING
        },
        rating: {
            type: DataTypes.INTEGER,
            required: true,
        }
    }, {
        sequelize,
        modelName: 'Users',
    });
    return Users;
};