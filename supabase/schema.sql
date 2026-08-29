-- 비뇨의학과 인트라넷 스키마
-- Supabase SQL Editor에서 실행하세요.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role text not null default '스텝',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.duty_shifts (
  id uuid primary key default gen_random_uuid(),
  duty_type text not null check (duty_type in ('staff', 'trainee', 'nurse')),
  duty_date date not null,
  person_name text not null,
  note text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists duty_shifts_date_type_idx
  on public.duty_shifts (duty_date, duty_type);

create table if not exists public.document_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text,
  fields jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references public.document_templates (id) on delete set null,
  title text not null,
  data jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consent_guides (
  id uuid primary key default gen_random_uuid(),
  surgery_name text not null,
  summary text,
  items jsonb not null default '[]'::jsonb,
  notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.terms (
  id uuid primary key default gen_random_uuid(),
  term text not null,
  abbreviation text,
  korean text,
  category text not null check (category in ('약어', '용어')),
  definition text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.procedures (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('술기', '수술')),
  indication text,
  content text not null,
  complications text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  generic_name text,
  category text not null,
  indication text,
  dosage text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_sets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  content text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  pinned boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', '사용자'),
    coalesce(new.raw_user_meta_data ->> 'role', '스텝')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.duty_shifts enable row level security;
alter table public.document_templates enable row level security;
alter table public.documents enable row level security;
alter table public.consent_guides enable row level security;
alter table public.terms enable row level security;
alter table public.procedures enable row level security;
alter table public.medications enable row level security;
alter table public.order_sets enable row level security;
alter table public.notices enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated using (true);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);

drop policy if exists "duty_all" on public.duty_shifts;
create policy "duty_all" on public.duty_shifts
  for all to authenticated using (true) with check (true);

drop policy if exists "templates_select" on public.document_templates;
create policy "templates_select" on public.document_templates
  for select to authenticated using (true);
drop policy if exists "templates_write" on public.document_templates;
create policy "templates_write" on public.document_templates
  for all to authenticated using (true) with check (true);

drop policy if exists "documents_all" on public.documents;
create policy "documents_all" on public.documents
  for all to authenticated using (true) with check (true);

drop policy if exists "consents_all" on public.consent_guides;
create policy "consents_all" on public.consent_guides
  for all to authenticated using (true) with check (true);

drop policy if exists "terms_all" on public.terms;
create policy "terms_all" on public.terms
  for all to authenticated using (true) with check (true);

drop policy if exists "procedures_all" on public.procedures;
create policy "procedures_all" on public.procedures
  for all to authenticated using (true) with check (true);

drop policy if exists "medications_all" on public.medications;
create policy "medications_all" on public.medications
  for all to authenticated using (true) with check (true);

drop policy if exists "orders_all" on public.order_sets;
create policy "orders_all" on public.order_sets
  for all to authenticated using (true) with check (true);

drop policy if exists "notices_all" on public.notices;
create policy "notices_all" on public.notices
  for all to authenticated using (true) with check (true);
