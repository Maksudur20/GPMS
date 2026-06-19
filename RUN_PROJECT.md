# 🚀 GPMS - One-Click Setup Guide

## ⚠️ IMPORTANT: Install Node.js First

Your system doesn't have Node.js installed yet. This is required to run the project.

---

## Step 1: Download & Install Node.js

### Option A: Direct Download (Recommended)
1. Go to: **https://nodejs.org/**
2. Click **"Download LTS"** (v20.x)
3. Run the installer (`.msi` file)
4. Click "Next" through the setup steps
5. **Important**: Restart PowerShell/Terminal after installation

### Option B: Using Winget (Windows 11+)
```powershell
winget install OpenJS.NodeJS
```

### Option C: Using Chocolatey
```powershell
choco install nodejs
```

---

## Step 2: Verify Installation

Open **New PowerShell** and run:
```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.12.0
9.8.1
```

---

## Step 3: Run Database Migration

Once Node.js is installed, run these commands in PowerShell:

```powershell
cd d:\GPMS\backend
npm install
npm run prisma:generate
npm run prisma:push
npm run seed
```

### What These Do:
- **npm install** - Downloads 50+ dependencies
- **npm run prisma:generate** - Creates database client
- **npm run prisma:push** - Creates tables in Supabase
- **npm run seed** - Adds default admin & settings

---

## Step 4: Start Backend Server

In the same PowerShell window:
```powershell
npm run dev
```

You should see:
```
[nodemon] starting `node src/server.js`
Server running on port 5000
```

---

## Step 5: Start Frontend (New PowerShell Window)

Open a **new PowerShell** and run:
```powershell
cd d:\GPMS\frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:3000/
```

---

## Step 6: Access Application

1. Open browser: **http://localhost:3000**
2. Login with temporary credentials (after seed):
   - Username: `admin`
   - Password: `password` (or create new account)

---

## What's Running

| Service | URL | Status |
|---------|-----|--------|
| Frontend (React) | http://localhost:3000 | ✅ Running |
| Backend API | http://localhost:5000/api | ✅ Running |
| Database | Supabase PostgreSQL | ✅ Connected |

---

## Troubleshooting

### "node: command not found"
- **Fix**: Install Node.js from https://nodejs.org/
- Restart PowerShell after installation
- Run: `node --version` to verify

### "npm ERR! 404"
- **Fix**: Make sure you're in the correct folder
- Run from: `d:\GPMS\backend`

### "ECONNREFUSED - database"
- **Fix**: Check your DATABASE_URL password in `.env`
- Ensure Supabase project is active
- Run migration again: `npm run prisma:push`

### "Port 5000 already in use"
- **Fix**: Kill process on port 5000
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
  ```
- Or use different port: `PORT=5001 npm run dev`

### Frontend shows "Cannot GET"
- **Fix**: Make sure backend is running on port 5000
- Check `frontend/.env` has `VITE_API_URL=http://localhost:5000/api`

---

## What Was Already Set Up

✅ Database credentials in `.env`  
✅ Supabase project configured  
✅ Exchange Rate API ready  
✅ Code files uploaded to GitHub  
✅ Docker setup ready  

**Only thing needed**: Install Node.js and run the migration!

---

## Next Steps

1. **Install Node.js** from https://nodejs.org/ 
2. **Run migration** commands above
3. **Start backend**: `npm run dev` (in `d:\GPMS\backend`)
4. **Start frontend**: `npm run dev` (in `d:\GPMS\frontend`)
5. **Open** http://localhost:3000

---

## File Structure

```
d:\GPMS\
├── backend/
│   ├── src/
│   │   ├── server.js (Express app)
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   ├── prisma/
│   │   └── schema.prisma (Database schema)
│   └── .env (Database config - KEEP SECURE)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx
│   └── .env (API config)
│
├── docker-compose.yml (For local dev)
└── migrate.bat (Setup script)
```

---

## After Setup

### Available Commands

**Backend** (in `d:\GPMS\backend`):
```powershell
npm run dev              # Start dev server with hot reload
npm run prisma:studio   # Open Prisma UI (http://localhost:5555)
npm run prisma:push     # Migrate database
npm run seed            # Add default data
npm start               # Production build
```

**Frontend** (in `d:\GPMS\frontend`):
```powershell
npm run dev             # Dev server with HMR (http://localhost:3000)
npm run build           # Build for production
npm run preview         # Preview prod build
```

---

## 📚 Documentation

- [QUICK_START.md](QUICK_START.md) - 5-minute setup
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Database guide
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API endpoints
- [MIGRATION_INSTRUCTIONS.md](MIGRATION_INSTRUCTIONS.md) - Migration steps

---

## ✨ You're Almost There!

Just install Node.js and follow the steps above. The entire project will be running in under 5 minutes!

**Need help?** Check the troubleshooting section above or review the documentation files.

---

**Status**: Ready to deploy  
**Last Updated**: 2026-06-19  
**Version**: 1.0.0
