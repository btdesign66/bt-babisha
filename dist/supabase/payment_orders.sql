-- Supabase table for HDFC SmartGateway / Juspay payment orders.
-- Run in Supabase Dashboard → SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  order_id text not null unique,
  sg_internal_id text null,

  merchant_id text null,
  customer_id text null,
  customer_name text null,
  customer_email text null,
  customer_phone text null,
  customer_location text null,
  product_name text null,
  product_id text null,

  amount numeric(12,2) null check (amount is null or amount > 0),
  currency text null default 'INR',

  gateway_status text null,
  status text null,
  status_id integer null,

  txn_id text null,
  txn_uuid text null,
  payment_method text null,
  payment_method_type text null,
  auth_type text null,

  gateway_id integer null,
  gateway_reference_id text null,
  return_url text null,

  refunded boolean null default false,
  amount_refunded numeric(12,2) null,
  effective_amount numeric(12,2) null,

  raw_response_json jsonb not null default '{}'::jsonb,
  raw jsonb null
);

create index if not exists payment_orders_status_idx on public.payment_orders (status);
create index if not exists payment_orders_gateway_status_idx on public.payment_orders (gateway_status);
create index if not exists payment_orders_created_at_idx on public.payment_orders (created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_payment_orders_updated_at on public.payment_orders;
create trigger trg_payment_orders_updated_at
before update on public.payment_orders
for each row execute function public.set_updated_at();
