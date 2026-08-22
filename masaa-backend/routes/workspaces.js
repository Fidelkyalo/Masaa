import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/v1/workspaces
router.get('/', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const workspaces = db.getCollection('workspaces');
  res.json({ success: true, data: workspaces });
});

// POST /api/v1/workspaces/resources/book
router.post('/resources/book', (req, res) => {
  const { resourceId, resourceName, date, startTime, endTime, purpose } = req.body;
  const newResourceBooking = db.insert('events', {
    user_id: req.user?.id || 'usr_1',
    calendar_id: 'work',
    title: `Resource Reservation: ${resourceName || 'Meeting Room'}`,
    description: `Booked for ${purpose || 'Internal Sync'}`,
    date: date || new Date().toISOString().split('T')[0],
    startTime: startTime || '10:00',
    endTime: endTime || '11:00',
    category: 'work',
    color: '#8b5cf6',
    meetingType: 'physical',
    location: resourceName || 'Boardroom A'
  });

  res.status(201).json({ success: true, data: newResourceBooking, message: 'Resource reserved successfully' });
});

export default router;
