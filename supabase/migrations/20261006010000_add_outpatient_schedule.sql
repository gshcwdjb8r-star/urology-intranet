create table if not exists public.outpatient_schedule (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 1 and 5),
  session text not null check (session in ('am', 'pm')),
  doctor_names text[] not null default '{}',
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (weekday, session)
);

alter table public.outpatient_schedule enable row level security;

drop policy if exists "outpatient_schedule_all" on public.outpatient_schedule;
create policy "outpatient_schedule_all" on public.outpatient_schedule
  for all to authenticated using (true) with check (true);
