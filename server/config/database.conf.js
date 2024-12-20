require('dotenv').config();

const dbType = process.env.DB_TYPE || 'sqlite';

const commonConfig = {
    development: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mydatabase',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
    },
    test: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mydatabase_test',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
    },
    production: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mydatabase_production',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
    },
};

module.exports = dbType === 'mysql'
    ? {
        ...commonConfig,
        development: {
            ...commonConfig.development,
            dialect: 'mysql',
        },
        test: {
            ...commonConfig.test,
            dialect: 'mysql',
        },
        production: {
            ...commonConfig.production,
            dialect: 'mysql',
        },
    }
    : {
        development: {
            dialect: 'sqlite',
            storage: './rockytodo.db',
        },
        test: {
            dialect: 'sqlite',
            storage: './rockytodo_test.db',
        },
        production: {
            dialect: 'sqlite',
            storage: './rockytodo_production.db',
        },
    };
