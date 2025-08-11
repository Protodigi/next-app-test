import { createClient, SupabaseClient } from "@supabase/supabase-js"

/**
 * Creates a new Supabase client instance for use in server-side environments
 * (e.g., Server Components, API routes, or server-side rendering functions).
 * 
 * Unlike the browser client, this function creates a new instance on every call.
 * This is important for server environments to avoid sharing user sessions between different requests.
 * 
 * @returns {SupabaseClient} A new Supabase client instance.
 */
export function createServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient(url, anon, {
    // Configuration for the server client.
    auth: {
      // `persistSession` is set to `false` because server-side environments are stateless.
      // We should not persist sessions on the server; instead, session information (like a JWT)
      // should be passed with each request from the client.
      persistSession: false
    },
    global: { headers: { "X-Client-Info": "next-app-test/server" } }
  })
}