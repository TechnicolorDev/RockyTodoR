const { sequelize, DataTypes, Model } = require("../../database/database");
const { v4: uuidv4 } = require('uuid'); // Import uuid

class Role extends Model {}

Role.init(
    {
        roleId: {
            type: DataTypes.STRING(36),
            allowNull: false,
            unique: true,
            primaryKey: true,
            defaultValue: uuidv4(), // Automatically generate a full UUID when creating
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: 'Role name cannot be empty' },
                isAlphanumeric: { msg: 'Role name must be alphanumeric' },
            }
        },
    },
    {
        sequelize,
        modelName: 'Role',
        timestamps: false,
    }
);

const createDefaultRoles = async () => {
    try {
        // Check if the 'admin' role exists
        let adminRole = await Role.findOne({ where: { name: 'admin' } });

        if (!adminRole) {
            // Role does not exist, create it
            adminRole = await Role.create({ name: 'admin' });
            console.log('Admin role created');
        } else {
            console.log('Admin role already exists');
        }

        // Check if the 'user' role exists
        let userRole = await Role.findOne({ where: { name: 'user' } });

        if (!userRole) {
            // Role does not exist, create it
            userRole = await Role.create({ name: 'user' });
            console.log('User role created');
        } else {
            console.log('User role already exists');
        }

    } catch (error) {
        console.error('Error creating default roles:', error);
    }
};

// Run this function when the app starts
createDefaultRoles();

module.exports = { Role };
