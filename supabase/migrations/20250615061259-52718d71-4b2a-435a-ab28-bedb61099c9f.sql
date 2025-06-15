
-- Create product_type enum
create type public.product_type as enum ('course', 'template');

-- Create table for products (which includes courses and templates)
create table public.products (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamp with time zone not null default now(),
  title text not null,
  description text,
  price numeric not null,
  image_url text,
  slug text not null unique,
  instructor_id uuid references auth.users(id) on delete set null,
  product_type public.product_type not null default 'course'
);
comment on table public.products is 'Stores both courses and templates.';

-- Enable RLS for products
alter table public.products enable row level security;

-- Policy: Allow public read access for products
create policy "Products are viewable by everyone." on public.products for select using (true);

-- Policy: Allow authenticated users to insert products
create policy "Authenticated users can create products." on public.products for insert with check (auth.role() = 'authenticated');

-- Policy: Allow instructors to update their own products
create policy "Instructors can update their own products." on public.products for update using (auth.uid() = instructor_id) with check (auth.uid() = instructor_id);

-- Policy: Allow instructors to delete their own products
create policy "Instructors can delete their own products." on public.products for delete using (auth.uid() = instructor_id);


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
