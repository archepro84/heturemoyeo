'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Auths extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Auths.init({
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
        authData: {
            type: DataTypes.STRING(20),
            required: true,
        },
        isAuth: {
            type: DataTypes.TINYINT.UNSIGNED,
            required: true,
        }
    }, {
        sequelize,
        modelName: 'Auths',
    });
    return Auths;
};