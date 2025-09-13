# IWA™ - Phase 1 Prototype

This is a simple HTML, CSS, and JavaScript prototype for the IWA™ application. It covers user authentication and the basic application layout.

## How to Set Up and Run

### 1. Get Your Supabase Credentials

- Go to your Supabase project dashboard.
- In the left sidebar, click on **Settings** (the gear icon).
- Click on **API**.
- You will find your **Project URL** and your **`anon` `public` Key**.

### 2. Configure the Application

- Open the file `js/supabase-client.js`.
- Replace the placeholder values `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with the actual credentials you copied from your Supabase dashboard.
- Save the file.

### 3. (Optional) Disable Email Confirmation for Development

For easier testing, you can disable the need for users to confirm their email address after signing up.

- In your Supabase dashboard, go to **Authentication** -> **Providers**.
- Click on **Email** and toggle off the "Confirm email" option.

### 4. Run the Application

- Simply open the `login.html` file in your web browser (e.g., Chrome, Firefox).
- You can now sign up for a new account or sign in with an existing one.

That's it! You have a working Phase 1 prototype.
