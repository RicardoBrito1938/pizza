create table "public"."orders" (
    "id" uuid not null default uuid_generate_v4(),
    "quantity" integer not null,
    "amount" numeric(10,2) not null,
    "pizza" text not null,
    "size" text not null,
    "table_number" text not null,
    "status" text not null default 'preparing'::text,
    "waiter_id" uuid,
    "image" text not null,
    "created_at" timestamp without time zone default now()
);


alter table "public"."orders" enable row level security;

create table "public"."pizzas" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "name_insensitive" text generated always as (lower(TRIM(BOTH FROM name))) stored,
    "description" text not null,
    "price_size_s" numeric not null,
    "price_size_m" numeric not null,
    "price_size_l" numeric not null,
    "photo_url" text not null,
    "photo_path" text not null,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now()
);


alter table "public"."pizzas" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "email" text not null,
    "name" text,
    "is_admin" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX pizzas_pkey ON public.pizzas USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."pizzas" add constraint "pizzas_pkey" PRIMARY KEY using index "pizzas_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."orders" add constraint "orders_waiter_id_fkey" FOREIGN KEY (waiter_id) REFERENCES profiles(id) not valid;

alter table "public"."orders" validate constraint "orders_waiter_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, name, is_admin)
  VALUES (NEW.id, NEW.email, '', FALSE);
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."pizzas" to "anon";

grant insert on table "public"."pizzas" to "anon";

grant references on table "public"."pizzas" to "anon";

grant select on table "public"."pizzas" to "anon";

grant trigger on table "public"."pizzas" to "anon";

grant truncate on table "public"."pizzas" to "anon";

grant update on table "public"."pizzas" to "anon";

grant delete on table "public"."pizzas" to "authenticated";

grant insert on table "public"."pizzas" to "authenticated";

grant references on table "public"."pizzas" to "authenticated";

grant select on table "public"."pizzas" to "authenticated";

grant trigger on table "public"."pizzas" to "authenticated";

grant truncate on table "public"."pizzas" to "authenticated";

grant update on table "public"."pizzas" to "authenticated";

grant delete on table "public"."pizzas" to "service_role";

grant insert on table "public"."pizzas" to "service_role";

grant references on table "public"."pizzas" to "service_role";

grant select on table "public"."pizzas" to "service_role";

grant trigger on table "public"."pizzas" to "service_role";

grant truncate on table "public"."pizzas" to "service_role";

grant update on table "public"."pizzas" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "Allow authenticated users to create orders"
on "public"."orders"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Allow authenticated users to read orders"
on "public"."orders"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "Allow authenticated users to update orders"
on "public"."orders"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text))
with check ((auth.role() = 'authenticated'::text));


create policy "Allow authenticated users to update"
on "public"."pizzas"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text))
with check ((auth.role() = 'authenticated'::text));


create policy "Allow delete for authenticated users"
on "public"."pizzas"
as permissive
for delete
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow insert for authenticated users"
on "public"."pizzas"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Allow read access to all"
on "public"."pizzas"
as permissive
for select
to public
using (true);


create policy "Allow select for authenticated users"
on "public"."pizzas"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view their own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));



