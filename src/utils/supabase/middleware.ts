import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next()

  // Runtime validation of environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseAnonKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          supabaseResponse.cookies.set(name, value, options)
        },
        remove(name: string, options: any) {
          supabaseResponse.cookies.set(name, '', options)
        },
      },
    }
  )

  // Refresh session so it doesn't expire
  await supabase.auth.getSession()

  return supabaseResponse
}
