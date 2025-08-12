// This route handler is responsible for exchanging an auth code for a session cookie.
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Validate and normalize the redirect URL to prevent open redirects
  let next = '/'
  const nextParam = searchParams.get('next')
  
  if (nextParam) {
    // Only accept safe same-origin paths
    // Reject URLs with schemes, hosts, or starting with //
    if (!nextParam.includes('://') && !nextParam.startsWith('//') && nextParam.startsWith('/')) {
      // Check for CR/LF characters and other unsafe patterns
      if (!/[\r\n]/.test(nextParam)) {
        try {
          // Use URL constructor to safely resolve the path
          const resolvedUrl = new URL(nextParam, request.url)
          // Only extract the pathname and search, ignore host/scheme
          if (resolvedUrl.pathname.startsWith('/')) {
            next = resolvedUrl.pathname + resolvedUrl.search
          }
        } catch {
          // Invalid URL, fall back to default
          next = '/'
        }
      }
    }
  }

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
