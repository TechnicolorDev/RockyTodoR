const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');

// Get the database type from environment variables (default to 'sqlite')
const dbType = process.env.DB_TYPE || 'sqlite';

// Set up Sequelize instance with dynamic configuration
let sequelize;

if (dbType === 'mysql') {
    // MySQL Configuration
    sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST || 'localhost', // Default host
        port: process.env.DB_PORT || 3306,        // Default MySQL port
        database: process.env.DB_NAME || 'mydatabase', // Database name
        username: process.env.DB_USER || 'root',    // Database username
        password: process.env.DB_PASSWORD || '',   // Database password
        logging: false, // Disable query logging
    });
} else {
    // SQLite Configuration
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DB_STORAGE || 'todos.db', // Default SQLite file
        logging: false, // Disable query logging
    });
}

// Define Todo model
class Todo extends Model {}

Todo.init(
    {
        todoId: {
            type: DataTypes.STRING(8),
            allowNull: false,
            unique: true,
            defaultValue: () => crypto.randomBytes(4).toString('hex'),
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        repoUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        creationDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'Todo',
        timestamps: true, // Ensures createdAt and updatedAt fields are automatically managed
    }
);

// Define Admin model
class Admin extends Model {}

Admin.init(
    {
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
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetTokenExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Admin',
        timestamps: true, // Timestamps automatically managed
    }
);

// Initialize and sync the database
const initDB = async () => {
    try {
        await sequelize.authenticate(); // Authenticate the database connection
        await sequelize.sync({ alter: true }); // Sync tables and adjust schema if needed
        console.log('Database initialized.');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

// Export the models and initialization function
module.exports = { initDB, Todo, Admin, sequelize };
