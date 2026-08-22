# MASAA Backend API - Specification & Architecture

## Overview
This document outlines the backend architecture for MASAA Phase 2, built with Laravel, PostgreSQL, and Firebase Cloud Messaging.

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Framework | Laravel 11 |
| Database | PostgreSQL 15+ |
| Authentication | Laravel Sanctum + OAuth |
| API | REST API |
| Real-time | Firebase Cloud Messaging |
| Storage | S3/Cloud Storage |
| Deployment | Docker + Nginx |
| CI/CD | GitHub Actions |

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    uuid UUID UNIQUE,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    timezone VARCHAR(50),
    theme ENUM('light', 'dark', 'auto'),
    profile_picture_url VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    uuid UUID UNIQUE,
    user_id BIGINT NOT NULL,
    calendar_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    category VARCHAR(50),
    color VARCHAR(7),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (calendar_id) REFERENCES calendars(id),
    INDEX (user_id, event_date),
    INDEX (calendar_id)
};
```

### Calendars Table
```sql
CREATE TABLE calendars (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    uuid UUID UNIQUE,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7),
    icon VARCHAR(50),
    is_shared BOOLEAN DEFAULT FALSE,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX (user_id)
};
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    uuid UUID UNIQUE,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATE,
    priority ENUM('low', 'medium', 'high'),
    status ENUM('pending', 'in_progress', 'completed'),
    category VARCHAR(50),
    completed_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX (user_id, status)
};
```

### Booking Pages Table
```sql
CREATE TABLE booking_pages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    uuid UUID UNIQUE,
    user_id BIGINT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    slug VARCHAR(255) UNIQUE,
    meeting_duration INT DEFAULT 30,
    buffer_time INT DEFAULT 15,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX (user_id, slug)
};
```

### Availability Table
```sql
CREATE TABLE availabilities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_page_id BIGINT NOT NULL,
    day_of_week INT (0-6),
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (booking_page_id) REFERENCES booking_pages(id),
    INDEX (booking_page_id)
};
```

### Event Invitations Table
```sql
CREATE TABLE event_invitations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    uuid UUID UNIQUE,
    event_id BIGINT NOT NULL,
    invitee_email VARCHAR(255),
    invitee_name VARCHAR(255),
    status ENUM('pending', 'accepted', 'declined', 'maybe'),
    invitation_sent_at TIMESTAMP,
    response_at TIMESTAMP,
    created_at TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    INDEX (event_id, invitee_email)
};
```

### Reminders Table
```sql
CREATE TABLE reminders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id BIGINT,
    task_id BIGINT,
    reminder_type ENUM('email', 'push', 'sms'),
    remind_before_minutes INT,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    created_at TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    INDEX (event_id, is_sent)
};
```

### Calendar Shares Table
```sql
CREATE TABLE calendar_shares (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    calendar_id BIGINT NOT NULL,
    shared_with_user_id BIGINT NOT NULL,
    permission ENUM('view', 'edit', 'manage'),
    created_at TIMESTAMP,
    FOREIGN KEY (calendar_id) REFERENCES calendars(id),
    FOREIGN KEY (shared_with_user_id) REFERENCES users(id),
    UNIQUE KEY (calendar_id, shared_with_user_id)
};
```

---

## API Endpoints

### Authentication

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh-token
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
GET  /api/v1/auth/me
```

### Users

```
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
GET    /api/v1/users/:id/preferences
PATCH  /api/v1/users/:id/preferences
```

### Calendars

```
GET    /api/v1/calendars
POST   /api/v1/calendars
GET    /api/v1/calendars/:id
PATCH  /api/v1/calendars/:id
DELETE /api/v1/calendars/:id
GET    /api/v1/calendars/:id/events
GET    /api/v1/calendars/:id/shares
POST   /api/v1/calendars/:id/shares
DELETE /api/v1/calendars/:id/shares/:userId
```

### Events

```
GET    /api/v1/events
POST   /api/v1/events
GET    /api/v1/events/:id
PATCH  /api/v1/events/:id
DELETE /api/v1/events/:id
GET    /api/v1/events/:id/invitations
POST   /api/v1/events/:id/invitations
GET    /api/v1/events/:id/reminders
POST   /api/v1/events/:id/reminders
GET    /api/v1/events/date/:date
GET    /api/v1/events/range/:startDate/:endDate
```

### Tasks

```
GET    /api/v1/tasks
POST   /api/v1/tasks
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id/complete
GET    /api/v1/tasks/status/:status
```

### Booking Pages

```
GET    /api/v1/booking-pages
POST   /api/v1/booking-pages
GET    /api/v1/booking-pages/:id
PATCH  /api/v1/booking-pages/:id
DELETE /api/v1/booking-pages/:id
GET    /api/v1/booking-pages/:id/availability
PATCH  /api/v1/booking-pages/:id/availability
GET    /api/v1/booking-pages/:slug/public
POST   /api/v1/booking-pages/:id/bookings
GET    /api/v1/booking-pages/:id/bookings
```

### Integrations

```
POST   /api/v1/integrations/google-calendar/connect
POST   /api/v1/integrations/google-calendar/sync
POST   /api/v1/integrations/outlook/connect
POST   /api/v1/integrations/zoom/connect
GET    /api/v1/integrations/status
```

---

## Request/Response Examples

### Create Event

**Request:**
```json
POST /api/v1/events

{
  "calendar_id": 1,
  "title": "Team Meeting",
  "description": "Weekly sync",
  "event_date": "2024-12-15",
  "start_time": "10:00",
  "end_time": "11:00",
  "category": "work",
  "color": "#3B82F6",
  "location": "Conference Room A",
  "attendees": [
    {
      "email": "john@company.com",
      "name": "John Doe"
    }
  ],
  "reminders": [
    {
      "type": "email",
      "remind_before_minutes": 30
    },
    {
      "type": "push",
      "remind_before_minutes": 15
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Team Meeting",
    "event_date": "2024-12-15",
    "start_time": "10:00:00",
    "end_time": "11:00:00",
    "created_at": "2024-01-10T10:30:00Z",
    "updated_at": "2024-01-10T10:30:00Z"
  }
}
```

### Get Events in Range

**Request:**
```
GET /api/v1/events/range/2024-01-01/2024-01-31?calendar_id=1&sort=start_time
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Meeting 1",
      "event_date": "2024-01-15",
      "start_time": "10:00:00",
      "end_time": "11:00:00"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "per_page": 50
  }
}
```

---

## Authentication Flow

### JWT/Sanctum Token

1. User logs in with email/password
2. Backend verifies and returns API token
3. Client stores token in secure storage
4. Client includes token in Authorization header: `Bearer {token}`
5. Backend validates token on each request

### OAuth Integration (Google/Microsoft)

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth screen
3. Google returns auth code
4. Backend exchanges code for tokens
5. Backend creates/updates user
6. Return API token to frontend

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

---

## Rate Limiting

- **Authenticated Users**: 1000 requests/hour
- **Unauthenticated**: 100 requests/hour
- **Login Endpoint**: 5 attempts/minute

---

## Notification System

### Email Notifications (via Laravel Mail)
- Event invitations
- Event reminders
- Task deadlines
- Booking confirmations

### Push Notifications (Firebase Cloud Messaging)
- Event reminders
- Booking confirmations
- Calendar updates

### SMS (Future)
- Critical event reminders
- Booking confirmations

---

## Security Best Practices

✅ Use HTTPS only
✅ Implement CORS properly
✅ SQL injection prevention (Eloquent ORM)
✅ XSS protection
✅ CSRF tokens
✅ Rate limiting
✅ Input validation
✅ Output sanitization
✅ Secure password hashing (bcrypt)
✅ Environment variables for secrets
✅ Regular security audits

---

## Deployment

### Docker Setup
```dockerfile
FROM php:8.2-fpm

WORKDIR /app

COPY . .

RUN composer install
RUN npm install && npm run build

RUN chown -R www-data:www-data /app
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: masaa
      POSTGRES_PASSWORD: password

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

---

## Testing

### Unit Tests (PHPUnit)
```bash
php artisan test
```

### API Tests
```bash
php artisan test --filter=ApiTest
```

### Coverage
```bash
php artisan test --coverage
```

---

## Monitoring & Logging

- **Logging**: Laravel logs to `storage/logs/`
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: New Relic
- **Uptime Monitoring**: Uptime Robot

---

## Performance Optimization

- Database indexing
- Query optimization with Eager Loading
- Redis caching for frequently accessed data
- API response compression (Gzip)
- CDN for static assets
- Database connection pooling

---

## Future Enhancements

Phase 3 & beyond:
- AI scheduling suggestions
- Advanced analytics
- Team workspaces
- Third-party integrations marketplace
- Webhook support
- GraphQL API
- Real-time collaboration
- Mobile app specific endpoints

---

## References

- Laravel Documentation: https://laravel.com
- PostgreSQL: https://www.postgresql.org
- Firebase Cloud Messaging: https://firebase.google.com
- RESTful API Best Practices: https://restfulapi.net

---

**MASAA Backend — Powering Intelligent Scheduling**
