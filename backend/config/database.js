const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = null;
    this.connection = null;
  }

  async connect() {
    try {
      // First, connect without database to create it if needed
      const tempConnection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD
      });

      // Create database if it doesn't exist
      await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'task_management'}`);
      await tempConnection.end();

      // Create connection pool
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'task_management',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Get a connection to test
      this.connection = await this.pool.getConnection();
      console.log('✅ Connected to MySQL database');
      this.connection.release();
      
    } catch (error) {
      console.error('❌ Database connection error:', error);
      throw error;
    }
  }

  async initialize() {
    try {
      await this.connect();
      await this.createTables();
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization error:', error);
      throw error;
    }
  }

  async createTables() {
    try {
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;

      const createTasksTable = `
        CREATE TABLE IF NOT EXISTS tasks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(100) NOT NULL,
          description TEXT NOT NULL,
          status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
          priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
          due_date DATE NULL,
          user_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_status (status),
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;

      await this.pool.query(createUsersTable);
      await this.pool.query(createTasksTable);
      console.log('✅ Tables created successfully (if not already exist)');
    } catch (error) {
      console.error('Table creation error:', error);
      throw error;
    }
  }

  async execute(sql, params = []) {
    try {
      const [rows] = await this.pool.query(sql, params);
      return [rows];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  getDb() {
    return this.pool;
  }

  async closeConnection() {
    if (this.pool) {
      await this.pool.end();
      console.log('✅ MySQL connection pool closed');
    }
  }
}

const database = new Database();
module.exports = database;
