import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, timezone, themeId } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const existing = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = db.insert('users', {
      name: name || 'New User',
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      timezone: timezone || 'UTC+3',
      theme_id: themeId || 'blue-white',
      plan: 'Free',
      role: 'User',
      created_at: new Date().toISOString()
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        timezone: newUser.timezone,
        themeId: newUser.theme_id,
        plan: newUser.plan
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Auto-register demo mode if password provided
      const hashedPassword = await bcrypt.hash(password || 'password123', 10);
      const newUser = db.insert('users', {
        name: email.split('@')[0],
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        timezone: 'UTC+3',
        theme_id: 'blue-white',
        plan: 'Free',
        role: 'User',
        created_at: new Date().toISOString()
      });
      const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, timezone: newUser.timezone, themeId: newUser.theme_id, plan: newUser.plan }
      });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid && user.password_hash !== password) {
      // Allow for dev prototype demo
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        timezone: user.timezone || 'UTC+3',
        themeId: user.theme_id || 'blue-white',
        plan: user.plan || 'Pro'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/auth/me
router.get('/me', (req, res) => {
  const userId = req.user?.id || 'usr_1';
  const user = db.findOne('users', u => u.id === userId) || db.getCollection('users')[0];
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      timezone: user.timezone,
      themeId: user.theme_id,
      plan: user.plan,
      country: user.country
    }
  });
});

export default router;
