import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/v1/developer/keys
router.get('/keys', (req, res) => {
  const keys = [
    { id: 'key_1', name: 'Production Webhook API Key', key: 'masaa_live_pk_8492019482', created: '2024-03-10' },
    { id: 'key_2', name: 'Mobile Companion Key', key: 'masaa_live_pk_1029384756', created: '2024-04-15' }
  ];
  res.json({ success: true, keys });
});

// POST /api/v1/developer/keys
router.post('/keys', (req, res) => {
  const { name } = req.body;
  const newKey = {
    id: `key_${Date.now()}`,
    name: name || 'New API Key',
    key: `masaa_live_pk_${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    created: new Date().toISOString().split('T')[0]
  };
  res.status(201).json({ success: true, data: newKey });
});

// POST /api/v1/developer/webhooks
router.post('/webhooks', (req, res) => {
  const { url, events } = req.body;
  res.status(201).json({
    success: true,
    webhook: { id: `wh_${Date.now()}`, url, events: events || ['event.created', 'booking.created'], active: true }
  });
});

export default router;
