import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/v1/admin/overview
router.get('/overview', (req, res) => {
  const metrics = db.data.admin_metrics;
  const users = db.getCollection('users');
  const orgs = db.getCollection('workspaces');

  res.json({
    success: true,
    data: {
      totalUsers: users.length || metrics.totalUsers,
      activeUsers: metrics.activeUsers,
      mrr: `$${metrics.mrr.toLocaleString()}`,
      arr: `$${metrics.arr.toLocaleString()}`,
      activeOrgs: orgs.length || metrics.activeOrgs,
      aiCost: `$${metrics.aiCost.toFixed(2)}`,
      systemHealth: metrics.systemHealth
    }
  });
});

// GET /api/v1/admin/users
router.get('/users', (req, res) => {
  const users = db.getCollection('users').map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role || 'User',
    plan: u.plan || 'Free',
    status: 'Active',
    joined: u.created_at || '2024-01-10'
  }));
  res.json({ success: true, data: users });
});

// GET /api/v1/admin/ai-stats
router.get('/ai-stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalApiRequests: 248910,
      monthlyCost: '$1,240.50',
      avgLatencyMs: 180,
      modelUsage: { gpt4o: '65%', claude35: '25%', local: '10%' }
    }
  });
});

// GET /api/v1/admin/feature-flags
router.get('/feature-flags', (req, res) => {
  const flags = db.data.admin_metrics.featureFlags;
  res.json({ success: true, flags });
});

// POST /api/v1/admin/ai-query
router.post('/ai-query', (req, res) => {
  const { query } = req.body;
  res.json({
    success: true,
    query,
    insight: `Executive Analysis for "${query}": Platform MRR increased 18.4% this month. Business workspace upgrades in East Africa are outperforming targets. AI infrastructure spending remains well within budget at $1.2k.`
  });
});

export default router;
