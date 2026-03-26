-- Supabase table for HDFC SmartGateway order status responses.
-- Run this in Supabase Dashboard → SQL Editor (your "babisha" project).

create extension if not exists pgcrypto;

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- SmartGateway order id (merchant order id)
  order_id text not null unique,

  -- SmartGateway internal order id (e.g., ordeh_...)
  sg_internal_id text null,

  merchant_id text null,
  customer_id text null,
  customer_email text null,
  customer_phone text null,

  status text null,
  status_id integer null,
  amount numeric(12,2) null,
  currency text null,

  txn_id text null,
  txn_uuid text null,

  payment_method_type text null,
  payment_method text null,
  auth_type text null,

  return_url text null,
  product_id text null,

  gateway_id integer null,
  gateway_reference_id text null,

  refunded boolean null,
  amount_refunded numeric(12,2) null,
  effective_amount numeric(12,2) null,

  -- Full payload for audit/debug (stores exactly what SmartGateway returns)
  raw jsonb not null
);

create index if not exists payment_orders_status_idx on public.payment_orders (status);
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

