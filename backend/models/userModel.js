const database = require('../config/database');

/**
 * Find a user by email.
 * @param {string} email
 * @returns {Object|undefined}
 */
async function findUserByEmail(email) {
  const [rows] = await database.execute(
    'SELECT * FROM users WHERE email = ?',
    [email.toLowerCase()]
  );
  return rows[0];
}

/**
 * Find a user by ID.
 * @param {number} id
 * @returns {Object|undefined}
 */
async function findUserById(id) {
  const [rows] = await database.execute(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
}

/**
 * Create a new user.
 * @param {string} name
 * @param {string} email
 * @param {string} hashedPassword
 * @returns {Object} Created user (without password)
 */
async function createUser(name, email, hashedPassword) {
  const [result] = await database.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [name, email.toLowerCase(), hashedPassword]
  );
  
  const [rows] = await database.execute(
    'SELECT id, username, email, created_at FROM users WHERE id = ?',
    [result.insertId]
  );
  
  return rows[0];
}

module.exports = { findUserByEmail, findUserById, createUser };
