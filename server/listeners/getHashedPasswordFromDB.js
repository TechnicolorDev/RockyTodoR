const db = require('../database/database'); // Example: import your database connection or ORM

const getHashedPasswordFromDB = async (username) => {
    const user = await db.query('SELECT hashed_password FROM users WHERE username = ?', [username]);
    if (user.length === 0) {
        throw new Error("User not found");
    }
    return user[0].hashed_password; // Adjust based on your DB schema
};

module.exports = {getHashedPasswordFromDB}