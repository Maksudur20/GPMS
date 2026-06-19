#!/bin/bash

# GPMS Setup Script

echo "🚀 GPMS Project Setup Started..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Backend setup
echo ""
echo "📦 Setting up Backend..."
cd backend
npm install
cp .env.example .env
echo "⚠️  Please update .env with your Supabase credentials"
npm run prisma:generate
npm run prisma:push
cd ..

# Frontend setup
echo ""
echo "📦 Setting up Frontend..."
cd frontend
npm install
cp .env.example .env
cd ..

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "  1. Update backend/.env with your Supabase credentials"
echo "  2. Update frontend/.env with your API URL"
echo "  3. Start backend: cd backend && npm run dev"
echo "  4. Start frontend: cd frontend && npm run dev"
