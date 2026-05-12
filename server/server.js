require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./src/db');
const authRoutes = require('./src/routes/authRoutes');
const problemRoutes = require('./src/routes/problemRoutes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/problem', problemRoutes);

// Error Handling block
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke in the server!' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await db.initDB(); // Initialize DB tables if they don't exist
  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
};

startServer();
