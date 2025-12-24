# PostgreSQL Setup Guide for AI Health Companion

## Installation Options

### Option 1: Local PostgreSQL

#### **macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

#### **Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer
3. Remember your password!
4. Default port: 5432

#### **Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Option 2: Cloud PostgreSQL (Free Tiers)

#### **Railway (Recommended - Free $5/month credit):**
1. Go to https://railway.app/
2. Sign up with GitHub
3. Create new project → PostgreSQL
4. Copy connection string
5. Use in `.env` file

#### **Supabase (Free Forever Tier):**
1. Go to https://supabase.com/
2. Create account
3. Create new project
4. Go to Settings → Database
5. Copy connection string

#### **Render (Free Tier):**
1. Go to https://render.com/
2. Create account
3. New → PostgreSQL
4. Copy connection string

#### **Heroku (Free with credit card):**
1. Go to https://www.heroku.com/
2. Create app
3. Resources → Add Heroku Postgres
4. Copy DATABASE_URL

---

## Setup Instructions

### Step 1: Install PostgreSQL Locally

```bash
# macOS
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb health_companion

# Or use psql:
psql postgres
CREATE DATABASE health_companion;
\q
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend-postgresql

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Step 3: Configure .env

Edit `.env` file:
```env
PORT=5000
NODE_ENV=development

# Local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=health_companion
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=generate-a-random-string-here
FRONTEND_URL=http://localhost:3000
```

### Step 4: Start Backend

```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ PostgreSQL connected successfully
✅ Database synced successfully
🚀 Server running on http://localhost:5000
```

---

## Database Schema

PostgreSQL will automatically create this table:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL CHECK (length(name) >= 2),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL CHECK (length(password) >= 8),
  phone VARCHAR(20) NOT NULL,
  location VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL CHECK (date_of_birth < CURRENT_DATE),
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say')),
  login_attempts INTEGER DEFAULT 0,
  lock_until TIMESTAMP,
  password_changed_at TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

---

## Testing the Setup

### 1. Test Database Connection

```bash
# Check if server is running
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "OK",
  "message": "Server is running",
  "database": "PostgreSQL",
  "timestamp": "2025-12-24T..."
}
```

### 2. Test Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123456",
    "phone": "+1234567890",
    "location": "New York",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  }'
```

### 3. Test Signin

```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### 4. View Database

```bash
# Connect to database
psql health_companion

# View users table
SELECT id, name, email, created_at FROM users;

# Count users
SELECT COUNT(*) FROM users;

# Exit
\q
```

---

## Migrations (Schema Changes)

When you need to change the database structure:

### Using Sequelize CLI (Recommended)

```bash
# Install Sequelize CLI
npm install --save-dev sequelize-cli

# Initialize
npx sequelize-cli init

# Create migration
npx sequelize-cli migration:generate --name add-phone-verified-column

# Edit migration file in migrations/
# Run migration
npx sequelize-cli db:migrate

# Rollback if needed
npx sequelize-cli db:migrate:undo
```

### Manual SQL

```bash
psql health_companion

ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;

\q
```

---

## Security Best Practices

### 1. **Use Environment Variables**
Never commit `.env` to Git:
```bash
echo ".env" >> .gitignore
```

### 2. **Strong Database Password**
```bash
# Generate strong password
openssl rand -base64 32
```

### 3. **Database User Permissions**
```sql
-- Create dedicated user (not postgres superuser)
CREATE USER health_app WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE health_companion TO health_app;
```

### 4. **Connection Pooling**
Already configured in `server.js`:
```javascript
pool: {
  max: 5,      // Max connections
  min: 0,      // Min connections
  acquire: 30000,  // Max time to get connection
  idle: 10000  // Max idle time
}
```

### 5. **SSL in Production**
```javascript
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
```

---

## Production Deployment

### Railway (Recommended)

1. **Create Railway Account**
   - Go to https://railway.app/
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - New Project → PostgreSQL
   - Copy connection details

3. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Link project
   railway link
   
   # Set environment variables
   railway variables set DB_HOST=your_host
   railway variables set DB_USER=your_user
   railway variables set DB_PASSWORD=your_password
   railway variables set DB_NAME=your_db
   railway variables set JWT_SECRET=your_secret
   
   # Deploy
   railway up
   ```

### Heroku

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
heroku create health-companion-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set FRONTEND_URL=https://your-frontend.com
```

### Render

1. Create account at https://render.com/
2. New → Web Service
3. Connect GitHub repo
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

---

## Advanced Features

### 1. **Appointments Table** (Future Enhancement)

```javascript
const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending'
  },
  reason: {
    type: DataTypes.TEXT
  }
});

// Relationships
User.hasMany(Appointment);
Appointment.belongsTo(User);
```

### 2. **Audit Trail** (HIPAA Compliance)

```javascript
const AuditLog = sequelize.define('AuditLog', {
  userId: DataTypes.UUID,
  action: DataTypes.STRING,
  resource: DataTypes.STRING,
  ipAddress: DataTypes.STRING,
  userAgent: DataTypes.TEXT,
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});
```

### 3. **Database Backups**

```bash
# Manual backup
pg_dump health_companion > backup_$(date +%Y%m%d).sql

# Restore
psql health_companion < backup_20251224.sql

# Automated backups (cron job)
0 2 * * * pg_dump health_companion > /backups/backup_$(date +\%Y\%m\%d).sql
```

---

## Troubleshooting

### Problem: "Connection refused"
```bash
# Check if PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Start PostgreSQL
brew services start postgresql@16  # macOS
sudo systemctl start postgresql  # Linux
```

### Problem: "Database does not exist"
```bash
# Create database
createdb health_companion

# Or use psql
psql postgres
CREATE DATABASE health_companion;
\q
```

### Problem: "Password authentication failed"
```bash
# Reset postgres password
psql postgres
ALTER USER postgres WITH PASSWORD 'newpassword';
\q

# Update .env file with new password
```

### Problem: "Port 5432 already in use"
```bash
# Find process using port
lsof -i :5432

# Kill process (if needed)
kill -9 <PID>
```

---

## Monitoring & Maintenance

### View Active Connections
```sql
SELECT * FROM pg_stat_activity WHERE datname = 'health_companion';
```

### Database Size
```sql
SELECT pg_size_pretty(pg_database_size('health_companion'));
```

### Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Slow Queries
```sql
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

---

## Next Steps

1. ✅ PostgreSQL installed and running
2. ✅ Backend connected to database
3. ✅ User authentication working
4. ⬜ Add appointments table
5. ⬜ Add doctors table
6. ⬜ Add audit logging
7. ⬜ Set up automated backups
8. ⬜ Deploy to production
9. ⬜ HIPAA compliance audit

---

## Resources

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Sequelize Docs**: https://sequelize.org/docs/v6/
- **HIPAA Compliance**: https://www.hhs.gov/hipaa/
- **Railway**: https://docs.railway.app/
- **Heroku Postgres**: https://devcenter.heroku.com/categories/postgres-basics

---

