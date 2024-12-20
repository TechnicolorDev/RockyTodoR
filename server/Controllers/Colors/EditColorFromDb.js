const { sequelize, DataTypes, Model } = require("../../database/database");

class Color extends Model{}

Color.init(
    {
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Color',
        timestamps: true,
    }
);

module.exports = {Color};