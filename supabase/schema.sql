-- Lifeboard schema

create table if not exists dashboard_metrics (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  value int not null default 0,
  unique (user_id, label)
);

create table if not exists gtj_entries (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date timestamptz not null default now(),
  activity text not null,
  energy int not null,
  engagement int not null
);

create table if not exists prototypes (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  hypothesis text not null,
  next_step text not null,
  due_date date,
  tags text[] not null default '{}',
  status text not null default 'backlog'
);

create table if not exists failure_reframes (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  failure text not null,
  lesson text not null
);

create table if not exists odyssey_plans (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  variant int not null,
  content text,
  unique (user_id, variant)
);

create table if not exists habits (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  trigger text not null,
  action text not null
);

create table if not exists weekly_reviews (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  week date not null,
  positives text,
  improvements text,
  unique (user_id, week)
);

alter table dashboard_metrics enable row level security;
alter table gtj_entries enable row level security;
alter table prototypes enable row level security;
alter table failure_reframes enable row level security;
alter table odyssey_plans enable row level security;
alter table habits enable row level security;
alter table weekly_reviews enable row level security;

do $$ begin
  create policy "Users manage metrics" on dashboard_metrics
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users manage gtj" on gtj_entries
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users manage prototypes" on prototypes
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users manage failures" on failure_reframes
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users manage odyssey" on odyssey_plans
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users manage habits" on habits
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users manage weekly reviews" on weekly_reviews
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;
