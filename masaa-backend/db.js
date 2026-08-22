import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'masaa_db.json');

// Default Database State Seed
const initialDatabase = {
  users: [
    {
      id: 'usr_admin',
      name: 'MASAA Admin',
      email: 'masaa.admin@gmail.com',
      password_hash: '$2a$10$wT0lqY8JmDqF1x4Y/u8PneL6WzCqN1K6jK3u6lqZ7lJ4L7d.9J5xK', // 'Admin123'
      timezone: 'UTC+3',
      theme_id: 'blue-white',
      plan: 'Enterprise',
      country: 'Kenya',
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_1',
      name: 'Fidel Kyalo',
      email: 'fidel@masaa.app',
      password_hash: '$2a$10$wT0lqY8JmDqF1x4Y/u8PneL6WzCqN1K6jK3u6lqZ7lJ4L7d.9J5xK', // 'password123'
      timezone: 'UTC+3',
      theme_id: 'blue-white',
      plan: 'Enterprise',
      country: 'Kenya',
      role: 'System Admin',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_2',
      name: 'Sarah Jenkins',
      email: 'sarah@acmecorp.com',
      password_hash: '$2a$10$wT0lqY8JmDqF1x4Y/u8PneL6WzCqN1K6jK3u6lqZ7lJ4L7d.9J5xK',
      timezone: 'UTC-5',
      theme_id: 'purple-dark',
      plan: 'Business',
      country: 'USA',
      role: 'Org Admin',
      created_at: new Date().toISOString()
    }
  ],
  calendars: [
    { id: 'personal', user_id: 'usr_1', name: 'Personal', color: '#10b981', is_default: true },
    { id: 'work',     user_id: 'usr_1', name: 'Work',     color: '#3b82f6', is_default: false },
    { id: 'school',   user_id: 'usr_1', name: 'School',   color: '#f59e0b', is_default: false },
    { id: 'church',   user_id: 'usr_1', name: 'Church',   color: '#8b5cf6', is_default: false },
    { id: 'family',   user_id: 'usr_1', name: 'Family',   color: '#ef4444', is_default: false }
  ],
  events: [
    {
      id: 'ev_1',
      user_id: 'usr_1',
      calendar_id: 'work',
      title: 'Executive Team Sync',
      description: 'Weekly platform roadmap review',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      category: 'work',
      color: '#3b82f6',
      meetingType: 'online',
      onlineLink: 'https://meet.google.com/masaa-sync-123',
      attendees: [{ email: 'john@co.com', status: 'accepted' }],
      reminders: ['15'],
      recurring: 'none',
      qr_code_id: 'MASAA-QR-849201'
    },
    {
      id: 'ev_2',
      user_id: 'usr_1',
      calendar_id: 'personal',
      title: 'Lunch & Focus Time',
      description: 'Break period',
      date: new Date().toISOString().split('T')[0],
      startTime: '12:00',
      endTime: '13:00',
      category: 'personal',
      color: '#10b981',
      meetingType: 'physical',
      location: 'Nairobi Java House',
      attendees: [],
      reminders: [],
      recurring: 'none'
    }
  ],
  tasks: [
    {
      id: 'tsk_1',
      user_id: 'usr_1',
      title: 'Finish Phase 2 REST API deployment',
      deadline: new Date().toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      category: 'work',
      subtasks: [
        { id: 'st_1', text: 'Build Express routes', done: true },
        { id: 'st_2', text: 'Connect database models', done: true },
        { id: 'st_3', text: 'Push to GitHub', done: false }
      ]
    },
    {
      id: 'tsk_2',
      user_id: 'usr_1',
      title: 'Review weekly analytics report',
      deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      priority: 'medium',
      completed: false,
      category: 'work',
      subtasks: []
    }
  ],
  goals: [
    {
      id: 'gl_1',
      user_id: 'usr_1',
      title: 'Launch MASAA Cloud SaaS Platform',
      category: 'Work',
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      target: 100,
      current: 75,
      color: '#3b82f6',
      description: 'Ship complete REST API & Cloud infrastructure',
      linkedTasks: ['tsk_1', 'tsk_2']
    }
  ],
  booking_pages: [
    {
      id: 'bp_1',
      user_id: 'usr_1',
      slug: 'fidel-kyalo',
      title: 'Book a Meeting with Fidel',
      description: 'Select an available slot for consultation or project sync.',
      availability: {
        monday:    { start: '09:00', end: '17:00', active: true },
        tuesday:   { start: '09:00', end: '17:00', active: true },
        wednesday: { start: '09:00', end: '17:00', active: true },
        thursday:  { start: '09:00', end: '17:00', active: true },
        friday:    { start: '09:00', end: '17:00', active: true },
        saturday:  { start: '10:00', end: '14:00', active: false },
        sunday:    { start: '10:00', end: '14:00', active: false }
      },
      meetingDuration: 30,
      bufferTime: 15,
      bookings: []
    }
  ],
  calendar_shares: [
    {
      id: 'sh_1',
      calendar_id: 'work',
      user_id: 'usr_1',
      email: 'sarah@acmecorp.com',
      permission: 'edit',
      sharedAt: '2024-05-01'
    }
  ],
  workspaces: [
    {
      id: 'ws_1',
      name: 'MASAA Global Workspace',
      type: 'business',
      admin_id: 'usr_1',
      departments: ['Engineering', 'Product', 'Sales', 'Support'],
      members: [
        { id: 'm1', name: 'Fidel Kyalo', role: 'Admin', email: 'fidel@masaa.app' },
        { id: 'm2', name: 'Sarah Jenkins', role: 'Manager', email: 'sarah@acmecorp.com' }
      ],
      resources: [
        { id: 'r1', name: 'Boardroom A (Projector + Video)', type: 'room', capacity: 12 },
        { id: 'r2', name: 'Company Vehicle - KDD 123X', type: 'vehicle', capacity: 5 }
      ]
    }
  ],
  payments: [
    {
      id: 'pay_1',
      user_id: 'usr_1',
      amount: 1500,
      currency: 'KES',
      provider: 'M-Pesa',
      transaction_ref: 'MPESA-TX-984021',
      status: 'Completed',
      created_at: new Date().toISOString()
    }
  ],
  admin_metrics: {
    totalUsers: 14820,
    activeUsers: 9450,
    mrr: 42500,
    arr: 510000,
    activeOrgs: 312,
    aiCost: 1240.50,
    systemHealth: '99.98%',
    featureFlags: {
      ai_natural_language: true,
      qr_attendance: true,
      mpesa_payments: true,
      zoom_auto_sync: true,
      resource_booking_v2: true,
      schedule_health_v2: false
    }
  }
};

// Database Engine Wrapper
class DatabaseEngine {
  constructor() {
    this.data = initialDatabase;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Failed to read DB file, using initial data:', err);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save DB file:', err);
    }
  }

  getCollection(name) {
    return this.data[name] || [];
  }

  setCollection(name, items) {
    this.data[name] = items;
    this.save();
  }

  find(name, predicate) {
    return (this.data[name] || []).filter(predicate);
  }

  findOne(name, predicate) {
    return (this.data[name] || []).find(predicate);
  }

  insert(name, item) {
    if (!this.data[name]) this.data[name] = [];
    const newItem = { id: item.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, ...item };
    this.data[name].push(newItem);
    this.save();
    return newItem;
  }

  update(name, predicate, patch) {
    if (!this.data[name]) return null;
    let updatedItem = null;
    this.data[name] = this.data[name].map(item => {
      if (predicate(item)) {
        updatedItem = { ...item, ...patch };
        return updatedItem;
      }
      return item;
    });
    this.save();
    return updatedItem;
  }

  delete(name, predicate) {
    if (!this.data[name]) return false;
    const initialLen = this.data[name].length;
    this.data[name] = this.data[name].filter(item => !predicate(item));
    this.save();
    return this.data[name].length < initialLen;
  }
}

export const db = new DatabaseEngine();
