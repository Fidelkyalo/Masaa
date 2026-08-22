import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/v1/booking-pages/me
router.get('/me', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const page = db.findOne('booking_pages', p => p.user_id === userId) || db.getCollection('booking_pages')[0];
  res.json({ success: true, data: page });
});

// PUT /api/v1/booking-pages/me
router.put('/me', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const page = db.findOne('booking_pages', p => p.user_id === userId);
  if (!page) {
    const newPage = db.insert('booking_pages', { user_id: userId, ...req.body });
    return res.json({ success: true, data: newPage });
  }
  const updated = db.update('booking_pages', p => p.user_id === userId, req.body);
  res.json({ success: true, data: updated });
});

// GET /api/v1/booking-pages/slots
router.get('/slots', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const page = db.findOne('booking_pages', p => p.user_id === userId) || db.getCollection('booking_pages')[0];
  const events = db.getCollection('events');

  // Generate 7-day slot availability
  const slots = [];
  const startDays = 1;
  for (let i = startDays; i <= 7; i++) {
    const date = new Date(Date.now() + i * 86400000).toISOString().split('T')[0];
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayCfg = page.availability?.[dayName];
    if (dayCfg && dayCfg.active) {
      const startH = parseInt(dayCfg.start.split(':')[0]);
      const endH = parseInt(dayCfg.end.split(':')[0]);
      for (let h = startH; h < endH; h++) {
        const timeStr = `${String(h).padStart(2, '0')}:00`;
        const busy = events.some(e => e.date === date && parseInt(e.startTime) === h);
        if (!busy) {
          slots.push({ date, time: timeStr, available: true });
        }
      }
    }
  }

  res.json({ success: true, data: slots });
});

// POST /api/v1/booking-pages/book
router.post('/book', (req, res) => {
  const { date, time, title, attendeeEmail, attendeeName } = req.body;
  const newBookingEvent = db.insert('events', {
    user_id: 'usr_1',
    calendar_id: 'work',
    title: title || `Booking: ${attendeeName || attendeeEmail}`,
    description: `Booked via public booking link by ${attendeeEmail}`,
    date,
    startTime: time,
    endTime: `${String(parseInt(time.split(':')[0]) + 1).padStart(2, '0')}:00`,
    category: 'meeting',
    color: '#3b82f6',
    meetingType: 'online',
    onlineLink: 'https://meet.google.com/masaa-booking-room',
    attendees: [{ email: attendeeEmail, name: attendeeName, status: 'accepted' }]
  });

  res.status(201).json({ success: true, data: newBookingEvent, message: 'Booking confirmed' });
});

export default router;
