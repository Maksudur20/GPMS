# Game Profit Management System (GPMS)

## Project Overview
Game Profit Management System (GPMS) is a web-based admin dashboard designed for game resellers. The system helps calculate game costs, currency conversions, payment charges, customer pricing, and profit margins while maintaining a complete order history.

The platform automatically converts Steam game prices from INR to BDT using a currency exchange API, applies payment charges, calculates profit, and stores all transaction records in a centralized dashboard.

---

# Technology Stack

## Frontend

- React.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- Recharts

## Backend

- Node.js
- Express.js

## Database

- Supabase PostgreSQL

## ORM

- Prisma ORM

## Deployment

- Frontend: Vercel
- Backend: Railway / Render
- Database: Supabase

---

# Business Workflow

1. Admin receives a game purchase request from a customer.
2. Steam game price (INR) is entered.
3. The system fetches the latest INR to BDT exchange rate using a Currency API.
4. The INR amount is converted into BDT.
5. The converted amount is rounded to a preferred value.
6. bKash/Card loading charges are applied.
7. The final acquisition cost is calculated.
8. Customer selling price is entered.
9. Profit is calculated automatically.
10. The order is saved in the database.
11. All records are displayed on the dashboard and analytics pages.

---

# Calculation Logic

## Currency Conversion
Formula:

Converted BDT = Steam Price × Exchange Rate

Example:

Steam Price = 479 INR

Exchange Rate = 1.30

Converted Amount:

479 × 1.30 = 622.70 BDT

Rounded Amount:

625 BDT

---

## Payment Charge Formula
Formula:

Final Cost = Amount + ((Charge Rate / 1000) × Amount)

Default Charge Rate:

12.50 per 1000

Example:

Amount = 625

Final Cost:

625 + ((12.50 / 1000) × 625)

= 632.8125 BDT

---

## Profit Calculation
Formula:

Profit = Customer Price − Final Cost

Example:

Customer Price = 690

Profit:

690 − 632.8125

= 57.1875 BDT

---

# Authentication Requirements
The system will use a custom authentication mechanism.

## Required

- Username Login
- Password Login
- Forgot Password

## Not Required

- Google Authentication
- Facebook Authentication
- OTP Login
- Supabase Authentication

Supabase will be used only as a PostgreSQL database provider.

---

# Core Features

## Dashboard
Overview statistics:

- Total Orders
- Total Revenue
- Total Profit
- Average Profit Per Order
- Today's Orders
- Today's Revenue
- Today's Profit

---

## Order Management
Create, update, and manage orders.

### Input Fields

- Game Name
- Steam Price (INR)
- Customer Price
- Order Status

### Auto-Calculated Fields

- Exchange Rate
- Converted BDT
- Rounded Amount
- Payment Charge
- Final Cost
- Profit

---

## Order Status

- Pending
- Purchased
- Delivered
- Cancelled

---

# Reports & Analytics

## Daily Reports

- Total Orders
- Revenue
- Profit

## Monthly Reports

- Revenue Summary
- Profit Summary
- Order Count

## Yearly Reports

- Total Revenue
- Total Profit
- Total Orders

---

# Settings Module
Admin can configure:

- Currency API URL
- Charge Rate Per 1000
- Default Profit Margin
- Currency Refresh Settings

Default Value:

Charge Rate = 12.50 per 1000

---

# Database Design

## Admin Table
| Field | Type |
|-------|------|
| id | UUID |
| username | VARCHAR |
| password | VARCHAR |
| created_at | TIMESTAMP |

---

## Orders Table
| Field | Type |
|-------|------|
| id | UUID |
| game_name | VARCHAR |
| steam_price_inr | DECIMAL |
| exchange_rate | DECIMAL |
| converted_bdt | DECIMAL |
| rounded_bdt | DECIMAL |
| payment_charge | DECIMAL |
| final_cost | DECIMAL |
| customer_price | DECIMAL |
| profit | DECIMAL |
| status | VARCHAR |
| created_at | TIMESTAMP |

---

## Settings Table
| Field | Type |
|-------|------|
| id | UUID |
| currency_api_url | TEXT |
| charge_per_1000 | DECIMAL |
| updated_at | TIMESTAMP |

---

# Prisma Models

## Admin

- id
- username
- password
- createdAt

## Order

- id
- gameName
- steamPriceInr
- exchangeRate
- convertedBdt
- roundedBdt
- paymentCharge
- finalCost
- customerPrice
- profit
- status
- createdAt

## Settings

- id
- currencyApiUrl
- chargePer1000
- updatedAt

---

# Environment Variables

```
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres

SUPABASE_URL=https://[PROJECT_ID].supabase.co

SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]

SUPABASE_SECRET_KEY=[YOUR_SUPABASE_SECRET_KEY]

JWT_SECRET=[YOUR_JWT_SECRET]

CURRENCY_API_URL=https://v6.exchangerate-api.com/v6/[YOUR_API_KEY]/latest/USD

CHARGE_PER_1000=12.50
```

**Note**: Replace placeholders with actual values from your Supabase dashboard and API providers.

---

# Currency API Configuration

## Exchange Rate API
- **Provider**: exchangerate-api.com
- **API Key**: 6c6dc34bebbfed4f5eeec80e
- **Endpoint**: https://v6.exchangerate-api.com/v6/6c6dc34bebbfed4f5eeec80e/latest/USD

## Expected API Response

```json
{
  "INR_BDT": 1.30
}
```

---

# Supabase Configuration

## Connection Details
- **Host**: aws-1-ap-northeast-1.pooler.supabase.com
- **Port**: 5432
- **Database**: postgres
- **User**: postgres.rtbkjsxweqsquqzfbhsp
- **Project ID**: rtbkjsxweqsquqzfbhsp
- **Project Name**: GPMS

## Connection String
```
postgresql://postgres.rtbkjsxweqsquqzfbhsp:[YOUR-PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

## API Keys
- **Public Key (Anon)**: [YOUR_SUPABASE_ANON_KEY]
- **Secret Key**: [YOUR_SUPABASE_SECRET_KEY]
- **Legacy JWT Secret**: [YOUR_JWT_SECRET]

## Installation
```bash
npx skills add supabase/agent-skills
```

---

# Automatic System Operations

The system should automatically:

- Fetch exchange rates from API
- Convert currency (INR to BDT)
- Calculate payment charges
- Calculate profit margins
- Store transaction history
- Generate reports and analytics

---

# Advanced Features (Future Scope)

## Steam URL Import
Allow admin to paste a Steam Store URL.

System automatically fetches:

- Game Name
- Current Steam Price
- Currency Information

---

## Profit Threshold Alerts
Admin can define:

Minimum Profit = 50 BDT

Maximum Profit = 100 BDT

The system will display alerts when profit falls outside the defined range.

---

## Export System
Export reports in:

- PDF
- Excel
- CSV

---

## Customer Ledger
Track customer information:

- Customer Name
- Phone Number
- Total Orders
- Total Revenue
- Total Profit

---

# Project Goal
The goal of GPMS is to provide a fast, accurate, and scalable game reseller management platform where administrators can easily calculate game costs, monitor profits, manage orders, and analyze business performance through a centralized dashboard.

---

# Project Summary

**Project Name**: Game Profit Management System (GPMS)

**Type**: Web-based Admin Dashboard

**Primary Use**: Game Reseller Management & Profit Calculation

**Target Users**: Game Resellers, Admin Users

**Key Features**: Order Management, Currency Conversion, Profit Calculation, Reports & Analytics, Dashboard

**Technology**: React.js, Node.js, Express.js, Supabase PostgreSQL, Prisma ORM

**Database**: Supabase (aws-1-ap-northeast-1)

**Status**: Development
