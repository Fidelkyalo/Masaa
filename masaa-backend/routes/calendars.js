import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/v1/calendars
router.get('/', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const calendars = db.find('calendars', c => c.user_id === userId || !c.user_id);
  res.json({ success: true, data: calendars });
});

// POST /api/v1/calendars
router.post('/', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const { name, color } = req.body;
  const newCal = db.insert('calendars', {
    user_id: userId,
    name: name || 'New Calendar',
    color: color || '#3b82f6',
    is_default: false
  });
  res.status(201).json({ success: true, data: newCal });
});

// GET /api/v1/calendars/shares
router.get('/shares', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const shares = db.find('calendar_shares', s => s.user_id === userId || !s.user_id);
  res.json({ success: true, data: shares });
});

// POST /api/v1/calendars/shares
router.post('/shares', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const { calendarId, email, permission } = req.body;
  const newShare = db.insert('calendar_shares', {
    user_id: userId,
    calendar_id: calendarId,
    email,
    permission: permission || 'view',
    sharedAt: new Date().toLocaleDateString()
  });
  res.status(201).json({ success: true, data: newShare });
});

export default router;
