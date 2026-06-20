const database = require('../config/database');

/**
 * Retrieve tasks for a specific user with search, sort, and pagination.
 * @param {number} userId
 * @param {Object} options - { status, search, sortOrder, page, limit }
 * @returns {{ tasks: Array, total: number, page: number, totalPages: number }}
 */
async function getTasksByUser(userId, options = {}) {
  const {
    status = '',
    search = '',
    sortOrder = 'desc',
    page = 1,
    limit = 6,
  } = options;

  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  let queryParams = [userId];

  // Filter by status
  if (status) {
    query += ' AND status = ?';
    queryParams.push(status);
  }

  // Search by title or description (case-insensitive)
  if (search.trim()) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    const searchTerm = `%${search.trim()}%`;
    queryParams.push(searchTerm, searchTerm);
  }

  // First get total count
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
  const [countResult] = await database.execute(countQuery, queryParams);
  const total = countResult[0].total;

  // Sort by created_at
  query += ` ORDER BY created_at ${sortOrder.toUpperCase()}`;

  const totalPages = Math.ceil(total / limit) || 1;
  const safePage = Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * limit;

  // Add pagination
  query += ' LIMIT ? OFFSET ?';
  queryParams.push(limit, offset);

  const [tasks] = await database.execute(query, queryParams);

  return { tasks, total, page: safePage, totalPages };
}

/**
 * Get dashboard statistics for a user.
 * @param {number} userId
 * @returns {{ total, pending, inProgress, completed }}
 */
async function getTaskStats(userId) {
  const [rows] = await database.execute(`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending,
      COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as inProgress,
      COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed
    FROM tasks WHERE user_id = ?
  `, [userId]);

  return {
    total: parseInt(rows[0].total || 0),
    pending: parseInt(rows[0].pending || 0),
    inProgress: parseInt(rows[0].inProgress || 0),
    completed: parseInt(rows[0].completed || 0),
  };
}

/**
 * Get a single task by ID (and verify ownership).
 * @param {number} id
 * @param {number} userId
 * @returns {Object|undefined}
 */
async function getTaskById(id, userId) {
  const [rows] = await database.execute(
    'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return rows[0];
}

/**
 * Create a new task for a user.
 * @param {number} userId
 * @param {string} title
 * @param {string} description
 * @param {string} status
 * @param {string} priority
 * @param {string} dueDate
 * @returns {Object}
 */
async function createTask(userId, title, description, status, priority = 'Medium', dueDate = null) {
  const [result] = await database.execute(
    'INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, title, description, status, priority, dueDate]
  );

  const [rows] = await database.execute(
    'SELECT * FROM tasks WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
}

/**
 * Update a task's status (only if owned by user).
 * @param {number} id
 * @param {number} userId
 * @param {string} status
 * @returns {Object|null}
 */
async function updateTaskStatus(id, userId, status) {
  const [result] = await database.execute(
    'UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
    [status, id, userId]
  );

  if (result.affectedRows === 0) return null;

  return await getTaskById(id, userId);
}

/**
 * Update a task (only if owned by user).
 * @param {number} id
 * @param {number} userId
 * @param {Object} updates
 * @returns {Object|null}
 */
async function updateTask(id, userId, updates) {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  
  if (fields.length === 0) return null;

  const setClause = fields.map(field => `${field} = ?`).join(', ');
  
  const [result] = await database.execute(
    `UPDATE tasks SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
    [...values, id, userId]
  );

  if (result.affectedRows === 0) return null;

  return await getTaskById(id, userId);
}

/**
 * Delete a task (only if owned by user).
 * @param {number} id
 * @param {number} userId
 * @returns {boolean}
 */
async function deleteTask(id, userId) {
  const [result] = await database.execute(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  getTasksByUser,
  getTaskStats,
  getTaskById,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
};
