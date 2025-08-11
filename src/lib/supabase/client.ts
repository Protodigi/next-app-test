'use client'
// This directive is important. It ensures that this module is treated as a Client Component module,
// meaning it can be imported and used within other Client Components like our pages.

import { createClient, SupabaseClient } from "@supabase/supabase-js"

// This variable will hold our single instance of the Supabase client.
// Using a singleton pattern like this prevents the creation of multiple, unnecessary
// Supabase client instances, which is more efficient.
let supabaseInstance: SupabaseClient | null = null

/**
 * A function to get the singleton Supabase client instance for use in browser environments (Client Components).
 * It ensures that the client is created only once and then reused on subsequent calls.
 * @returns {SupabaseClient} The singleton Supabase client instance.
 */
export function getSupabaseBrowser(): SupabaseClient {
  // If the instance doesn't exist yet, create it.
  if (!supabaseInstance) {
    // `createClient` initializes the Supabase client with the project URL and the public anon key.
    // These are pulled from environment variables, which is a best practice for managing configuration.
    supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        // Configuration for the browser client.
        auth: {
          persistSession: true, // Automatically saves the user's session in browser storage.
          detectSessionInUrl: true, // Detects sessions from the URL, used for OAuth and magic links.
        },
        global: { headers: { "X-Client-Info": "next-app-test/browser" } }
      }
    )
  }
  // Return the existing or newly created instance.
  return supabaseInstance
}