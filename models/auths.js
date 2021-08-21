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
        authId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            required: true,
        },
        phone: {
            type: DataTypes.STRING(100),
            required: true,
            unique: true
        },
        authData: {
            type: DataTypes.STRING(255),
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