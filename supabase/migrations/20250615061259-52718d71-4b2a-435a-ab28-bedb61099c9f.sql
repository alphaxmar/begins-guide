
-- Create table for courses
create table public.courses (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamp with time zone not null default now(),
  title text not null,
  description text,
  price numeric not null,
  image_url text,
  slug text not null unique,
  instructor_id uuid references auth.users(id) on delete set null
);

-- Enable RLS for courses
alter table public.courses enable row level security;

-- Policy: Allow public read access for courses
create policy "Courses are viewable by everyone."
on public.courses for select using (true);

-- Policy: Allow authenticated users to insert courses
create policy "Authenticated users can create courses."
on public.courses for insert with check (auth.role() = 'authenticated');

-- Policy: Allow instructors to update their own courses
create policy "Instructors can update their own courses."
on public.courses for update using (auth.uid() = instructor_id) with check (auth.uid() = instructor_id);

-- Policy: Allow instructors to delete their own courses
create policy "Instructors can delete their own courses."
on public.courses for delete using (auth.uid() = instructor_id);


-- Create table for articles
create table public.articles (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamp with time zone not null default now(),
  title text not null,
  excerpt text,
  content text,
  image_url text,
  slug text not null unique,
  category text,
  author_id uuid references auth.users(id) on delete set null
);

-- Enable RLS for articles
alter table public.articles enable row level security;

-- Policy: Allow public read access for articles
create policy "Articles are viewable by everyone."
on public.articles for select using (true);

-- Policy: Allow authenticated users to insert articles
create policy "Authenticated users can create articles."
on public.articles for insert with check (auth.role() = 'authenticated');

-- Policy: Allow authors to update their own articles
create policy "Authors can update their own articles."
on public.articles for update using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- Policy: Allow authors to delete their own articles
create policy "Authors can delete their own articles."
on public.articles for delete using (auth.uid() = author_id);
