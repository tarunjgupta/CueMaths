const express = require('express');
const { solve, analyzeMistake, getDashboard } = require('../controllers/problemController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticateToken); // Protect all problem routes

router.post('/solve', solve);
router.post('/analyze', analyzeMistake);
router.get('/dashboard', getDashboard);

module.exports = router;
