-- Run once in Supabase Dashboard → SQL Editor (project: babisha)
-- Adds customer / location columns and policies so payment_orders saves work from Vercel.

alter table public.payment_orders
  add column if not exists customer_name text null;

alter table public.payment_orders
  add column if not exists customer_location text null;

alter table public.payment_orders
  add column if not exists product_name text null;

-- Optional: ensure raw is always present for new rows
alter table public.payment_orders
  alter column raw set default '{}'::jsonb;

-- Allow server (service role / anon from API) to insert and update orders
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

-- Refresh PostgREST schema cache after column changes
notify pgrst, 'reload schema';
