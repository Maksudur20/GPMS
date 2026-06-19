# Supabase SQL Migrations

This file contains SQL commands to set up the GPMS database schema in Supabase.

## Method 1: Using Prisma (Recommended)

### Prerequisites
- Node.js installed
- backend/.env configured with DATABASE_URL

### Steps
1. Navigate to backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run prisma:generate`
4. Push schema to database: `npm run prisma:push`

---

## Method 2: Manual SQL in Supabase Dashboard

If you prefer to create tables manually:

### 1. Login to Supabase
- Go to: https://app.supabase.com
- Select your project: GPMS

### 2. Open SQL Editor
- Click "SQL Editor" in the left sidebar
- Click "New Query"

### 3. Run the following SQL commands:

```sql
-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username varchar UNIQUE NOT NULL,
  email varchar UNIQUE NOT NULL,
  password varchar NOT NULL,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "gameName" varchar NOT NULL,
  "steamPriceInr" numeric(10,2) NOT NULL,
  "exchangeRate" numeric(10,4) NOT NULL,
  "convertedBdt" numeric(10,2) NOT NULL,
  "roundedBdt" numeric(10,2) NOT NULL,
  "paymentCharge" numeric(10,2) NOT NULL,
  "finalCost" numeric(10,2) NOT NULL,
  "customerPrice" numeric(10,2) NOT NULL,
  profit numeric(10,2) NOT NULL,
  status varchar DEFAULT 'Pending',
  notes varchar,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "currencyApiUrl" text NOT NULL,
  "chargePer1000" numeric(10,4) DEFAULT 12.50,
  "minProfit" numeric(10,2) DEFAULT 50,
  "maxProfit" numeric(10,2) DEFAULT 100,
  "updatedAt" timestamp with time zone DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_admins_username ON public.admins(username);
CREATE INDEX idx_admins_email ON public.admins(email);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_createdAt ON public.orders("createdAt");

-- Insert default admin (optional)
INSERT INTO public.admins (username, email, password)
VALUES ('admin', 'admin@gpms.local', '$2a$10$YourHashedPasswordHere')
ON CONFLICT (username) DO NOTHING;

-- Insert default settings (optional)
INSERT INTO public.settings ("currencyApiUrl", "chargePer1000", "minProfit", "maxProfit")
VALUES ('https://v6.exchangerate-api.com/v6/[YOUR_API_KEY]/latest/USD', 12.50, 50, 100)
ON CONFLICT DO NOTHING;
```

### 4. Click "Run" button to execute

---

## Method 3: Using psql Command Line

If you have PostgreSQL client installed:

```bash
psql postgresql://postgres.rtbkjsxweqsquqzfbhsp:YOUR_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres << EOF

-- [Paste the SQL commands above]

EOF
```

---

## Verify Tables Created

In Supabase dashboard:
1. Go to "Table Editor"
2. You should see three tables:
   - admins
   - orders
   - settings

---

## Next Steps

1. Backend server: `cd backend && npm run dev`
2. Frontend server: `cd frontend && npm run dev`
3. Login with credentials (admin/password after hashing)
4. Create test orders
5. Verify data in Supabase dashboard

---

## Troubleshooting

### "Connection refused" error
- Verify DATABASE_URL in .env is correct
- Check Supabase project is active
- Ensure password is correct

### "Table already exists" error
- Tables might be already created
- Check Supabase dashboard for existing tables
- Run migrations using Prisma: `npm run prisma:push`

### Data not appearing
- Verify Supabase connection
- Check auth token permissions
- Review logs in `backend/logs/`
