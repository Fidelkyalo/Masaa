import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/v1/events
router.get('/', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const { date, calendarId } = req.query;
  let events = db.getCollection('events');
  if (date) events = events.filter(e => e.date === date);
  if (calendarId) events = events.filter(e => e.calendar_id === calendarId);
  res.json({ success: true, data: events });
});

// GET /api/v1/events/range
router.get('/range', (req, res) => {
  const { start, end } = req.query;
  let events = db.getCollection('events');
  if (start && end) {
    events = events.filter(e => e.date >= start && e.date <= end);
  }
  res.json({ success: true, data: events });
});

// POST /api/v1/events
router.post('/', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const eventData = req.body;
  const newEvent = db.insert('events', {
    user_id: userId,
    calendar_id: eventData.calendarId || 'personal',
    title: eventData.title || 'Untitled Event',
    description: eventData.description || '',
    date: eventData.date || new Date().toISOString().split('T')[0],
    startTime: eventData.startTime || '09:00',
    endTime: eventData.endTime || '10:00',
    category: eventData.category || 'personal',
    color: eventData.color || '#3b82f6',
    meetingType: eventData.meetingType || 'physical',
    location: eventData.location || '',
    onlineLink: eventData.onlineLink || '',
    attendees: eventData.attendees || [],
    reminders: eventData.reminders || [],
    recurring: eventData.recurring || 'none',
    qr_code_id: `MASAA-QR-${Math.floor(100000 + Math.random() * 900000)}`
  });
  res.status(201).json({ success: true, data: newEvent });
});

// PUT /api/v1/events/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updated = db.update('events', e => e.id === id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Event not found' });
  res.json({ success: true, data: updated });
});

// DELETE /api/v1/events/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.delete('events', e => e.id === id);
  res.json({ success: deleted });
});

// POST /api/v1/events/:id/qr-verify
router.post('/:id/qr-verify', (req, res) => {
  const { id } = req.params;
  const { qrCodeId } = req.body;
  const event = db.findOne('events', e => e.id === id || e.qr_code_id === qrCodeId);
  if (!event) return res.status(404).json({ success: false, verified: false, message: 'Invalid ticket' });
  res.json({ success: true, verified: true, event: { title: event.title, date: event.date, time: event.startTime } });
});

export default router;
