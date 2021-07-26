'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Tags extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Tags.init({
        tagId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            required: true
        },
        postId: {
            type: DataTypes.INTEGER,
            required: true
        },
        tag: {
            type: DataTypes.STRING,
            required: true
        }
    }, {
        sequelize,
        modelName: 'Tags',
    });

    Tags.associate = function (models) {
        models.Tags.hasMany(models.Posts, {
            foreignKey: 'postId',
            onDelete: 'cascade',
        })
    }
    return Tags;
};