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

3. Set up Supabase:

   - Ensure you have a Supabase project set up.
   - Update the `.env` file with your Supabase URL and keys:
     ```
     EXPO_PUBLIC_SUPABASE_URL=<your-supabase-url>
     EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
     ```

4. Migrations:

   - The database migrations are already included in the project under `supabase/migrations`.
   - If you need to reapply the migrations manually in the future:
     - Navigate to the `supabase/migrations` directory:
       ```bash
       cd supabase/migrations
       ```
     - Apply the migrations using the Supabase CLI:
       ```bash
       supabase db push
       ```

5. Follow the instructions for setting up Firebase:

   [Using Firebase with Expo](https://docs.expo.dev/guides/using-firebase/)

6. Create authentication and storage in the Firebase console. Retrieve the configuration file and paste it into the `firebase.js` file.

## Database Schema

The database includes the following tables:

- **profiles**: Stores user profiles with fields for `id`, `email`, `name`, and `is_admin`.
- **pizzas**: Stores pizza details such as `name`, `description`, `price_size_s`, `price_size_m`, `price_size_l`, and `photo_url`.
- **orders**: Stores order details including `quantity`, `amount`, `pizza`, `size`, `table_number`, and `status`.

## Policies and Security

- Row-Level Security (RLS) is enabled for all tables.
- Policies are defined to allow authenticated users to perform specific actions on the tables.

For more details, refer to the migration file: `supabase/migrations/20250325_add_my_changes.sq.sql`.

