// models/user.js
const { sequelize, DataTypes, Model } = require("../../database/database");
const { Role } = require("./roles");  // Import Role model
const crypto = require('crypto');

class User extends Model {}

User.init(
    {
        userId: {
            type: DataTypes.STRING(8), // Shorter IDs are fine, but be consistent across the app
            allowNull: false,
            unique: true,
            defaultValue: () => crypto.randomBytes(4).toString('hex'),  // Using crypto for user IDs
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        roleId: {
            type: DataTypes.STRING,
            allowNull: false,  // Assuming every user has a role
            references: {
                model: Role,
                key: 'roleId',  // Correct reference to the 'roleId' in the 'Role' model
            },
        },
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: true,
    }
);

// Define the association: User belongs to Role
User.belongsTo(Role, { foreignKey: 'roleId' });

module.exports = { User };
