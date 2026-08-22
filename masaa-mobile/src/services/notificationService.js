// MASAA Mobile Push Notification Service
export class NotificationService {
  constructor() {
    this.token = null;
  }

  async init() {
    console.log('[Push Notification Service] Initialized FCM listener.');
    this.token = `fcm_token_${Date.now()}`;
    return this.token;
  }

  async scheduleLocalReminder(title, body, date) {
    console.log(`[Push Notification Service] Reminder scheduled for "${title}" on ${date}: ${body}`);
    return { id: `notif_${Date.now()}`, title, body, scheduledFor: date };
  }
}

export const notificationService = new NotificationService();
