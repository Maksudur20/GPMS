# GPMS - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Prerequisites
```bash
# Install Node.js (v18 or v20)
# Download from: https://nodejs.org/

# Verify installation
node --version
npm --version
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

### 4. Login
- Username: `admin`
- Password: `password` (after seeding) or create new account

---

## 📋 Full Setup Checklist

- [ ] Node.js installed (v18+)
- [ ] backend/.env updated with DATABASE password
- [ ] frontend/.env configured
- [ ] `npm install` in backend folder
- [ ] `npm install` in frontend folder
- [ ] Supabase schema migrated (`npm run prisma:push`)
- [ ] Backend server running (`npm run dev`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Login successful
- [ ] First order created

---

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres.rtbkjsxweqsquqzfbhsp:YOUR_PASSWORD@...
SUPABASE_URL=https://rtbkjsxweqsquqzfbhsp.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
JWT_SECRET=sJvDtkY/pH2mnv...
CURRENCY_API_URL=https://v6.exchangerate-api.com/v6/[YOUR_API_KEY]/latest/USD
PORT=5000
NODE_ENV=development
CHARGE_PER_1000=12.50
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [PROJECT_SPECIFICATION.md](PROJECT_SPECIFICATION.md) | Detailed project requirements |
| [DATABASE_SETUP.md](DATABASE_SETUP.md) | Database configuration guide |
| [SUPABASE_MIGRATION.md](SUPABASE_MIGRATION.md) | SQL migration guide |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | API endpoints reference |
| [INSTALLATION.md](INSTALLATION.md) | Complete installation guide |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Code style & conventions |
| [SECURITY.md](SECURITY.md) | Security guidelines |
| [STATUS.md](STATUS.md) | Development status |

---

## 🛠️ Common Commands

### Backend
```bash
npm run dev              # Start dev server
npm run prisma:studio   # Open Prisma Studio UI
npm run prisma:push     # Migrate database
npm run seed            # Seed default data
npm start               # Start production server
```

### Frontend
```bash
npm run dev             # Start dev server with HMR
npm run build           # Build for production
npm run preview         # Preview production build
```

---

## 🔧 Troubleshooting

### npm: command not found
- Install Node.js: https://nodejs.org/
- Restart terminal after installation

### Connection refused (database)
- Check DATABASE_URL in backend/.env
- Verify Supabase project status
- Confirm database password

### CORS errors
- Ensure backend is running (port 5000)
- Check frontend .env has correct API_URL

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

---

## 📊 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/auth/register | ✗ | Register admin |
| POST | /api/auth/login | ✗ | Login admin |
| POST | /api/orders | ✓ | Create order |
| GET | /api/orders | ✓ | List orders |
| PUT | /api/orders/:id | ✓ | Update order |
| DELETE | /api/orders/:id | ✓ | Delete order |
| GET | /api/dashboard/stats | ✓ | Dashboard stats |
| GET | /api/settings | ✓ | Get settings |
| PUT | /api/settings | ✓ | Update settings |

---

## 🌐 Deployment

### Frontend to Vercel
```bash
# Push to GitHub
git push origin main

# Connect GitHub repo to Vercel
# Set VITE_API_URL to production backend URL
```

### Backend to Railway/Render
```bash
# Push to GitHub
git push origin main

# Connect repository to Railway/Render
# Set environment variables
# Deploy automatically on push
```

---

## 📞 Support

- **Issues**: Check [STATUS.md](STATUS.md)
- **Setup Help**: See [DATABASE_SETUP.md](DATABASE_SETUP.md)
- **API Help**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Code Style**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## ✅ What's Included

✅ Full-stack web application
✅ Backend API (Express.js)
✅ Frontend SPA (React + Vite)
✅ Database (Supabase PostgreSQL)
✅ Authentication (JWT)
✅ Order management system
✅ Dashboard with analytics
✅ Docker containerization
✅ CI/CD pipeline (GitHub Actions)
✅ Comprehensive documentation

---

**Last Updated**: 2026-06-19
**Status**: Ready for Development
**Version**: 1.0.0
