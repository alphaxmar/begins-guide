
-- Create table for user profiles
create table public.profiles (
  id uuid not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  constraint id foreign key (id) references auth.users(id) on delete cascade
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policy: Allow public read access
create policy "Public profiles are viewable by everyone."
on public.profiles for select using (true);

-- Policy: Allow users to insert their own profile
create policy "Users can insert their own profile."
on public.profiles for insert with check (auth.uid() = id);

-- Policy: Allow users to update their own profile
create policy "Users can update their own profile."
on public.profiles for update using (auth.uid() = id);

-- Function to create a profile for a new user
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- Trigger to run the function on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
