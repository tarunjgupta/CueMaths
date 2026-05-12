const axios = require('axios');
const db = require('../db');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const solve = async (req, res) => {
  const { question, difficulty, user_level } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  try {
    // 1. Call AI service for solution
    const response = await axios.post(`${AI_SERVICE_URL}/solve`, {
      question,
      difficulty: difficulty || 'medium',
      user_level: user_level || 'beginner',
    });
    
    const { steps, final_answer, topic, follow_up } = response.data;
    
    // 2. Save problem to DB if it doesn't exist
    const probResult = await db.query(
      'INSERT INTO problems (question_text, topic, difficulty) VALUES ($1, $2, $3) RETURNING id',
      [question, topic || 'Unknown', difficulty || 'medium']
    );
    const problem_id = probResult.rows[0].id;

    res.json({
      problem_id,
      steps,
      final_answer,
      topic,
      follow_up
    });
  } catch (error) {
    console.error('Solve error:', error.message);
    res.status(500).json({ error: 'Error processing problem' });
  }
};

const analyzeMistake = async (req, res) => {
  const { problem_id, user_answer, correct_answer, time_taken } = req.body;
  const user_id = req.user.userId;

  try {
    // 1. Call AI service to analyze
    const response = await axios.post(`${AI_SERVICE_URL}/analyze`, {
      user_answer,
      correct_answer
    });
    
    const { is_correct, explanation, conceptual_gap } = response.data;

    // 2. Log attempt
    await db.query(
      `INSERT INTO attempts 
      (user_id, problem_id, user_answer, is_correct, ai_explanation, mistake_analysis, time_taken) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [user_id, problem_id, user_answer, is_correct, explanation, conceptual_gap, time_taken || 0]
    );

    // 3. Update Progress
    const prob = await db.query('SELECT topic FROM problems WHERE id = $1', [problem_id]);
    const topic = prob.rows[0].topic;

    const prog = await db.query('SELECT * FROM progress WHERE user_id = $1 AND topic = $2', [user_id, topic]);
    if (prog.rows.length === 0) {
      const accuracy = is_correct ? 100 : 0;
      await db.query(
        'INSERT INTO progress (user_id, topic, accuracy, attempts_count) VALUES ($1, $2, $3, 1)',
        [user_id, topic, accuracy]
      );
    } else {
      const p = prog.rows[0];
      const attempts_count = p.attempts_count + 1;
      // Recalculate accuracy roughly
      const currentSuccess = (p.accuracy / 100) * p.attempts_count;
      const newSuccess = currentSuccess + (is_correct ? 1 : 0);
      const newAccuracy = (newSuccess / attempts_count) * 100;

      await db.query(
        'UPDATE progress SET accuracy = $1, attempts_count = $2, last_updated = CURRENT_TIMESTAMP WHERE id = $3',
        [newAccuracy, attempts_count, p.id]
      );
    }

    res.json({
      is_correct,
      explanation,
      conceptual_gap
    });
  } catch (error) {
    console.error('Analyze error:', error.message);
    res.status(500).json({ error: 'Error analyzing mistake' });
  }
};

const getDashboard = async (req, res) => {
  const user_id = req.user.userId;
  try {
    const progress = await db.query('SELECT * FROM progress WHERE user_id = $1', [user_id]);
    const attempts = await db.query(
      `SELECT a.*, p.question_text, p.topic 
       FROM attempts a 
       JOIN problems p ON a.problem_id = p.id 
       WHERE a.user_id = $1 
       ORDER BY a.created_at DESC LIMIT 10`,
      [user_id]
    );

    res.json({
      progress: progress.rows,
      recent_attempts: attempts.rows
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Error fetching progress' });
  }
};

module.exports = { solve, analyzeMistake, getDashboard };
