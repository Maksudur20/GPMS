# GPMS Database Setup Guide

## Prerequisites

### 1. Install Node.js
- Download from: https://nodejs.org/
- Install LTS version (v18 or v20)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Supabase Project Created
- Project ID: `rtbkjsxweqsquqzfbhsp`
- Project Name: `GPMS`
- Region: ap-northeast-1

---

## Database Setup Steps

### Step 1: Update Database Password

Edit `backend/.env` and replace `YOUR_PASSWORD` with your actual Supabase database password:

```env
DATABASE_URL=postgresql://postgres.rtbkjsxweqsquqzfbhsp:YOUR_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- Express.js
- Prisma ORM
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- axios (HTTP requests)
- cors (cross-origin support)

### Step 3: Generate Prisma Client

```bash
npm run prisma:generate
```

This reads the schema from `prisma/schema.prisma` and generates the Prisma client.

### Step 4: Push Schema to Supabase

```bash
npm run prisma:push
```

This will:
- Create the `admins` table
- Create the `orders` table
- Create the `settings` table
- Set up relationships and constraints

### Step 5: Seed Database (Optional)

```bash
npm run seed
```

This creates:
- Default admin user (username: admin)
- Default settings (charge rate, profit thresholds)

---

## Tables Created

### Admins Table
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gameName VARCHAR NOT NULL,
  steamPriceInr DECIMAL(10,2) NOT NULL,
  exchangeRate DECIMAL(10,4) NOT NULL,
  convertedBdt DECIMAL(10,2) NOT NULL,
  roundedBdt DECIMAL(10,2) NOT NULL,
  paymentCharge DECIMAL(10,2) NOT NULL,
  finalCost DECIMAL(10,2) NOT NULL,
  customerPrice DECIMAL(10,2) NOT NULL,
  profit DECIMAL(10,2) NOT NULL,
  status VARCHAR DEFAULT 'Pending',
  notes VARCHAR,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Settings Table
```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  currencyApiUrl TEXT NOT NULL,
  chargePer1000 DECIMAL(10,4) DEFAULT 12.50,
  minProfit DECIMAL(10,2) DEFAULT 50,
  maxProfit DECIMAL(10,2) DEFAULT 100,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Environment Variables Configured

```env
# Database Connection
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:YOUR_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres

# Supabase Project Details
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SECRET_KEY=[YOUR_SECRET_KEY]

# Authentication
JWT_SECRET=[YOUR_JWT_SECRET]

# Currency Exchange API
CURRENCY_API_URL=https://v6.exchangerate-api.com/v6/[API_KEY]/latest/USD

# Server Config
PORT=5000
NODE_ENV=development

# Payment Settings
CHARGE_PER_1000=12.50
```

⚠️ **Note**: All credential placeholders ([YOUR_*], [API_KEY], etc.) are masked for security.
See the actual `.env` file in your project for real values.

---

## Verify Setup

### 1. Test Database Connection

```bash
cd backend
npx prisma studio
```

This opens Prisma Studio at `http://localhost:5555` where you can:
- View all tables
- Add/edit records
- Test database connection

### 2. Test API Server

```bash
npm run dev
```

Visit `http://localhost:5000/api/health` - should return:
```json
{
  "status": "Server is running",
  "timestamp": "2026-06-19T10:30:00.000Z"
}
```

### 3. Test Frontend Connection

```bash
cd ../frontend
npm run dev
```

Frontend will be available at `http://localhost:3000`

---

## Troubleshooting

### Connection Refused
- Check DATABASE_URL is correct
- Verify Supabase project is running
- Confirm password is correct

### Migration Conflicts
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Then run migration again
npm run prisma:push
```

### Prisma Client Errors
```bash
# Regenerate Prisma client
npm run prisma:generate

# Clear cache
rm -rf node_modules/.prisma
npm install
```

---

## Next Steps

1. ✅ Update DATABASE password in `.env`
2. ✅ Run `npm install` in backend
3. ✅ Run `npm run prisma:push` to create tables
4. ✅ Run `npm run dev` to start server
5. ✅ Test API endpoints
6. ✅ Set up frontend and test login

---

## Support

- Supabase Docs: https://supabase.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Exchange Rate API: https://www.exchangerate-api.com/docs
