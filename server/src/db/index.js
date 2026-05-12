const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_learning_companion',
});

// Initialize database schema
const initDB = async () => {
  try {
    const query = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
    await pool.query(query);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDB,
};
