import { db } from './db.js';

console.log('🌱 Seeding MASAA database with fresh sample data...');

// Force database reload & save
db.load();
db.save();

console.log('✅ MASAA Database successfully seeded with 9 spec tables!');
console.log(`- Users: ${db.getCollection('users').length}`);
console.log(`- Calendars: ${db.getCollection('calendars').length}`);
console.log(`- Events: ${db.getCollection('events').length}`);
console.log(`- Tasks: ${db.getCollection('tasks').length}`);
console.log(`- Goals: ${db.getCollection('goals').length}`);
console.log(`- Booking Pages: ${db.getCollection('booking_pages').length}`);
console.log(`- Workspaces: ${db.getCollection('workspaces').length}`);
