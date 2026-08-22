import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/v1/goals
router.get('/', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const goals = db.find('goals', g => g.user_id === userId || !g.user_id);
  res.json({ success: true, data: goals });
});

// POST /api/v1/goals
router.post('/', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const goalData = req.body;
  const newGoal = db.insert('goals', {
    user_id: userId,
    title: goalData.title || 'New Goal',
    category: goalData.category || 'Work',
    deadline: goalData.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    target: goalData.target || 100,
    current: goalData.current || 0,
    color: goalData.color || '#3b82f6',
    description: goalData.description || '',
    linkedTasks: goalData.linkedTasks || []
  });
  res.status(201).json({ success: true, data: newGoal });
});

// PATCH /api/v1/goals/:id/link-task
router.patch('/:id/link-task', (req, res) => {
  const { id } = req.params;
  const { taskId } = req.body;
  const goal = db.findOne('goals', g => g.id === id);
  if (!goal) return res.status(404).json({ success: false, error: 'Goal not found' });
  const linkedTasks = [...(goal.linkedTasks || []), taskId];
  const updated = db.update('goals', g => g.id === id, { linkedTasks });
  res.json({ success: true, data: updated });
});

// DELETE /api/v1/goals/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.delete('goals', g => g.id === id);
  res.json({ success: deleted });
});

export default router;
