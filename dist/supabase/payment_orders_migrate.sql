-- Run in Supabase SQL Editor (project: babisha)
-- Extends payment_orders for full HDFC/Juspay field persistence.

alter table public.payment_orders
  add column if not exists customer_name text null;

alter table public.payment_orders
  add column if not exists customer_location text null;

alter table public.payment_orders
  add column if not exists product_name text null;

alter table public.payment_orders
  add column if not exists gateway_status text null;

alter table public.payment_orders
  add column if not exists raw_response_json jsonb null;

-- Backfill raw_response_json from legacy raw column
update public.payment_orders
set raw_response_json = raw
where raw_response_json is null
  and raw is not null;

alter table public.payment_orders enable row level security;

drop policy if exists "payment_orders_service_role_all" on public.payment_orders;
create policy "payment_orders_service_role_all"
  on public.payment_orders
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "payment_orders_anon_write" on public.payment_orders;
create policy "payment_orders_anon_write"
  on public.payment_orders
  for all
  to anon
  using (true)
  with check (true);

notify pgrst, 'reload schema';
