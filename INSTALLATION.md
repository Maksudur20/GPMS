# GPMS Installation & Development Guide

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL or Supabase account
- Git

### Step 1: Clone or Initialize Repository

```bash
cd d:\GPMS
git init
git add .
git commit -m "Initial project setup"
```

### Step 2: Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run prisma:generate
npm run prisma:push
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

Frontend will run on `http://localhost:3000`

## Default Configuration

### Charge Calculation
- Default charge rate: 12.50 per 1000
- Formula: `Final Cost = Rounded Amount + ((12.50/1000) × Rounded Amount)`

### Currency Conversion
- Uses exchangerate-api.com
- Converts from INR to BDT

### Profit Thresholds (Configurable)
- Minimum profit: 50 BDT
- Maximum profit: 100 BDT

## API Testing

### Register Admin
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123"
}
```

### Login Admin
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

### Create Order
```bash
POST http://localhost:5000/api/orders
Authorization: Bearer [TOKEN]
Content-Type: application/json

{
  "gameName": "Elden Ring",
  "steamPriceInr": 479,
  "customerPrice": 690
}
```

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL in `.env` is correct
- Check Supabase connection status

### CORS Errors
- Ensure backend is running on port 5000
- Frontend proxy is configured in vite.config.js

### Missing Dependencies
```bash
# Reinstall node_modules
npm ci
```

## Development Tips

1. **Use Prisma Studio** to manage database:
   ```bash
   npm run prisma:studio
   ```

2. **Check API health**:
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Monitor Exchange Rates**:
   - Exchange rate is fetched automatically for each order
   - Rate is cached in order record

## Production Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set VITE_API_URL to production backend URL
4. Deploy

## Support & Documentation

- See `PROJECT_SPECIFICATION.md` for detailed requirements
- See `README.md` for project overview
