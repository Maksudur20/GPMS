# GPMS - Database Migration Setup Instructions

## ⚠️ Node.js Required

To migrate the Supabase database and complete the setup, you need to install Node.js v18 or v20.

### Step 1: Install Node.js

1. Visit: **https://nodejs.org/**
2. Download the **LTS version** (v20.x recommended)
3. Run the installer and follow the prompts
4. Restart your terminal/PowerShell after installation

### Step 2: Verify Installation

Open a new PowerShell and run:
```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.x.x
9.x.x
```

---

## Step 3: Install Dependencies & Migrate

Once Node.js is installed, run these commands in PowerShell:

```powershell
cd d:\GPMS\backend
npm install
npm run prisma:generate
npm run prisma:push
```

### What These Commands Do:
1. **npm install** - Downloads all dependencies (Express, Prisma, bcryptjs, etc.)
2. **npm run prisma:generate** - Creates Prisma client from schema
3. **npm run prisma:push** - Creates tables in Supabase PostgreSQL

---

## Step 4: Seed Database (Optional)

To create default admin account and settings:
```powershell
npm run seed
```

---

## Step 5: Update GitHub

After migration succeeds, commit changes:
```powershell
cd d:\GPMS
git add backend\prisma\migrations
git commit -m "database: Add Prisma migrations for Supabase PostgreSQL tables"
git push origin main
```

---

## What Gets Created in Supabase

Three tables will be created automatically:

### 1. **admins** table
- Columns: id, username, email, password, createdAt, updatedAt
- Indexes: username (UNIQUE), email (UNIQUE)

### 2. **orders** table  
- Columns: id, gameName, steamPriceInr, exchangeRate, convertedBdt, roundedBdt, paymentCharge, finalCost, customerPrice, profit, status, notes, createdAt, updatedAt
- Indexes: status, createdAt

### 3. **settings** table
- Columns: id, currencyApiUrl, chargePer1000, minProfit, maxProfit, updatedAt

---

## After Migration

Your database will be:
- ✅ Connected to Supabase
- ✅ Tables created
- ✅ Ready for API calls
- ✅ Seeded with defaults (if you run seed)

Then you can run:
```powershell
cd d:\GPMS\backend
npm run dev
```

Backend will start on: **http://localhost:5000**

---

## Troubleshooting

### "npm: command not found"
- Node.js is not installed or PATH not updated
- Restart PowerShell after Node.js installation
- Verify with: `node --version`

### "ECONNREFUSED - database"
- Check DATABASE_URL password in `.env`
- Ensure Supabase project is active
- Test connection: `npx prisma db execute --stdin < test.sql`

### "Prisma schema not found"
- Make sure you're in the `backend` folder
- Run from: `d:\GPMS\backend`

---

## Next: Frontend Setup

After backend migration succeeds:
```powershell
cd d:\GPMS\frontend
npm install
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

**Ready?** Install Node.js from https://nodejs.org/ and follow the commands above!
