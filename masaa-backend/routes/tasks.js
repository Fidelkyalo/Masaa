import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/v1/tasks
router.get('/', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const tasks = db.find('tasks', t => t.user_id === userId || !t.user_id);
  res.json({ success: true, data: tasks });
});

// POST /api/v1/tasks
router.post('/', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const taskData = req.body;
  const newTask = db.insert('tasks', {
    user_id: userId,
    title: taskData.title || 'New Task',
    deadline: taskData.deadline || new Date().toISOString().split('T')[0],
    priority: taskData.priority || 'medium',
    completed: false,
    category: taskData.category || 'work',
    subtasks: taskData.subtasks || []
  });
  res.status(201).json({ success: true, data: newTask });
});

// PATCH /api/v1/tasks/:id/toggle
router.patch('/:id/toggle', (req, res) => {
  const { id } = req.params;
  const task = db.findOne('tasks', t => t.id === id);
  if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
  const updated = db.update('tasks', t => t.id === id, { completed: !task.completed });
  res.json({ success: true, data: updated });
});

// DELETE /api/v1/tasks/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.delete('tasks', t => t.id === id);
  res.json({ success: deleted });
});

export default router;
