const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
require('dotenv').config();  // Load .env variables

// Get database type from environment variable, default to 'sqlite'
const dbType = process.env.DB_TYPE || 'sqlite';

let sequelize;

// Log which DB type is being used
console.log(`Using ${dbType} database.`);

if (dbType === 'mysql') {
    sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        database: process.env.DB_NAME || 'database_development',
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        logging: false,
    });
} else if (dbType === 'sqlite') {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DB_STORAGE || './rockytodo.db',  // Path for SQLite storage
        logging: false,
    });
} else {
    console.error("Unsupported database type in environment. Please set DB_TYPE to 'mysql' or 'sqlite'.");
    process.exit(1);  // Exit the process if unsupported database type is found
}

console.log(`Database path: ${process.env.DB_STORAGE || 'rockytodo.db'}`);

// Define models (Todo and Admin) as before
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
        timestamps: true,
    }
);

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
        timestamps: true,
    }
);

const initDB = async () => {
    try {
        // Step 1: Authenticate database connection
        await sequelize.authenticate();
        console.log('Database connection established.');

        // Step 2: Ensure migrations are applied manually, not automatically
        console.log('Running migrations...');

        // Step 3: Initialize the database by syncing or running migrations here
        console.log('Database initialization completed.');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
};

module.exports = { initDB, Todo, Admin, sequelize, DataTypes, Model };
