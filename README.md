# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npx expo start
   ```

3. Follow the instructions for setting up Firebase:

   [Using Firebase with Expo](https://docs.expo.dev/guides/using-firebase/)

4. Create authentication and storage in the Firebase console. Retrieve the configuration file and paste it into the `firebase.js` file.

 

 -- Create profiles table
create table
  public.profiles (
    id uuid not null primary key references auth.users(id) on delete cascade,
    email text not null,
    name text,
    is_admin boolean not null default false,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
  );

-- Set up Row Level Security
alter table profiles enable row level security;

-- Create policy to allow users to read their own profile
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

-- Create policy to allow users to update their own profile
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, is_admin)
  VALUES (NEW.id, NEW.email, '', FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that calls the function when a new user is confirmed
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();




  -- pizza table 

  CREATE TABLE pizzas (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    name_insensitive text GENERATED ALWAYS AS (lower(trim(name))) STORED,
    description text NOT NULL,
    price_size_s numeric NOT NULL,
    price_size_m numeric NOT NULL,
    price_size_l numeric NOT NULL,
    photo_url text NOT NULL,
    photo_path text NOT NULL,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

ALTER TABLE pizzas ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert rows
CREATE POLICY "Allow insert for authenticated users"
ON pizzas
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to select rows
CREATE POLICY "Allow select for authenticated users"
ON pizzas
FOR SELECT
USING (auth.uid() IS NOT NULL);


bucket
-- Allow authenticated users to upload files
CREATE POLICY "Allow uploads for authenticated users"
ON storage.objects
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to read files
CREATE POLICY "Allow reads for authenticated users"
ON storage.objects
FOR SELECT
USING (auth.uid() IS NOT NULL);

create policy "Public access to pizzas"
on storage.objects
for select
using (bucket_id = 'pizzas');


-- Enable public read access for the 'pizzas' bucket
create policy "Public read access to pizzas"
on storage.objects
for select
using (
  bucket_id = 'pizzas'
);


CREATE POLICY "Allow delete for authenticated users"
ON public.pizzas
FOR DELETE
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users"
ON storage.objects
FOR DELETE
USING (auth.role() = 'authenticated' AND bucket_id = 'pizzas');

asdfadsf


create table orders (
    id uuid default uuid_generate_v4() primary key,
    quantity int not null,
    amount numeric(10, 2) not null,
    pizza text not null,
    size text not null,
    table_number text not null,
    status text not null default 'preparing',
    waiter_id uuid references profiles(id),
    image text not null,
    created_at timestamp default now()
);

-- Enable Row-Level Security
alter table orders enable row level security;

-- Allow authenticated users to insert orders
create policy "Allow authenticated users to create orders"
on orders
for insert
with check (auth.uid() is not null);

-- Allow authenticated users to read their orders
create policy "Allow authenticated users to read orders"
on orders
for select
using (auth.uid() is not null);


adfadfadsfadsf

-- Enable RLS for the pizzas table
ALTER TABLE pizzas ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to update rows
CREATE POLICY "Allow authenticated users to update"
ON pizzas
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

adfadsfad

CREATE POLICY "Allow authenticated users to update orders"
ON orders
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');


adfa
-- Allow read access to all users
CREATE POLICY "Allow read access to all" 
ON public.pizzas
FOR SELECT
USING (true);