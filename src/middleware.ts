import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

/**
 * Next.js middleware allows you to run code on the server before a request is completed.
 * It runs on the "edge" (a lightweight V8 runtime), making it very fast.
 * This function is executed for every request that matches the `config.matcher` pattern.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {NextResponse} The response to send back to the client.
 */
export function middleware(req: NextRequest) {
  // This is a placeholder middleware. The original comment suggests it was intended
  // to redirect users from the /todos page if they weren't logged in.
  // However, the current implementation lets all requests pass through and relies
  // on the client-side check in `todos/page.tsx` to handle redirection.
  
  // A more robust implementation could involve checking for a session cookie here
  // and redirecting on the server-side to prevent the client-side page from even loading.
  
  const path = req.nextUrl.pathname
  if (path.startsWith("/todos")) {
    // Currently, this block does nothing and lets the request continue.
  }
  
  // `NextResponse.next()` continues the request lifecycle, allowing the page or route handler to be executed.
  return NextResponse.next()
}

/**
 * The `config` object specifies which paths the middleware should run on.
 * The `matcher` pattern is a regular expression that matches all paths EXCEPT for:
 * - `_next/...` (Next.js internal files)
 * - `...\..*` (files with an extension, like images or CSS files)
 * This effectively runs the middleware on all page and route requests.
 */
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
}