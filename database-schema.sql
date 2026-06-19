-- GPMS Database Schema - Direct SQL Migration
-- Run this in Supabase SQL Editor if Prisma migration fails
-- Go to: https://app.supabase.com → SQL Editor → New Query

-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username character varying NOT NULL,
  email character varying NOT NULL,
  password character varying NOT NULL,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (username),
  UNIQUE (email)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  "gameName" character varying NOT NULL,
  "steamPriceInr" numeric(10,2) NOT NULL,
  "exchangeRate" numeric(10,4) NOT NULL,
  "convertedBdt" numeric(10,2) NOT NULL,
  "roundedBdt" numeric(10,2) NOT NULL,
  "paymentCharge" numeric(10,2) NOT NULL,
  "finalCost" numeric(10,2) NOT NULL,
  "customerPrice" numeric(10,2) NOT NULL,
  profit numeric(10,2) NOT NULL,
  status character varying DEFAULT 'Pending'::character varying,
  notes character varying,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  "currencyApiUrl" text NOT NULL,
  "chargePer1000" numeric(10,4) DEFAULT '12.50'::numeric,
  "minProfit" numeric(10,2) DEFAULT '50'::numeric,
  "maxProfit" numeric(10,2) DEFAULT '100'::numeric,
  "updatedAt" timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admins_username ON public.admins USING btree (username);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins USING btree (email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders USING btree (status);
CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON public.orders USING btree ("createdAt");

-- Enable RLS (Row Level Security) for admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create default settings if none exist
INSERT INTO public.settings ("currencyApiUrl", "chargePer1000", "minProfit", "maxProfit")
SELECT 
  'https://v6.exchangerate-api.com/v6/6c6dc34bebbfed4f5eeec80e/latest/USD',
  12.50,
  50,
  100
WHERE NOT EXISTS (SELECT 1 FROM public.settings);

-- Grant permissions (optional - adjust as needed)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admins TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT SELECT, UPDATE ON public.settings TO authenticated;
