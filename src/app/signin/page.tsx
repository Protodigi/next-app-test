'use client'
// This component is a Client Component because it uses hooks (`useState`) for interactive form input.

import { useState } from "react"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"

// This Next.js setting forces the page to be dynamically rendered.
export const dynamic = "force-dynamic"

/**
 * The sign-in page, providing multiple authentication methods.
 * It allows users to sign in with email/password, a passwordless magic link, or OAuth with GitHub.
 */
export default function SignInPage() {
  // Local state variables to manage the form inputs and loading status.
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  /**
   * Handles the magic link sign-in process.
   * It sends a one-time password (OTP) to the user's email, which contains a link to sign them in.
   */
  const handleMagicLink = async () => {
    const supabaseBrowser = getSupabaseBrowser()
    if (!email) return
    setLoading(true)
    try {
      const { error } = await supabaseBrowser.auth.signInWithOtp({
        email,
        options: {
          // The user will be redirected to this URL after clicking the magic link.
          emailRedirectTo:
            typeof window !== "undefined" ? `${window.location.origin}/todos` : undefined
        }
      })
      if (error) throw error
      toast.success("Check your email for the magic link")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send magic link"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles the traditional email and password sign-in.
   */
  const handleEmailPasswordSignIn = async () => {
    const supabaseBrowser = getSupabaseBrowser()
    if (!email || !password) {
      toast.error("Email and password are required")
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      
      // On successful sign-in, redirect the user to the main application page.
      if (data.user) {
        toast.success("Successfully signed in!")
        window.location.href = "/todos"
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles the OAuth sign-in process with GitHub.
   * This will redirect the user to GitHub for authorization.
   */
  const handleGithub = async () => {
    const supabaseBrowser = getSupabaseBrowser()
    setLoading(true)
    try {
      const { error } = await supabaseBrowser.auth.signInWithOAuth({
        provider: "github",
        options: {
          // GitHub will redirect the user back to this URL after authorization.
          redirectTo:
            typeof window !== "undefined" ? `${window.location.origin}/todos` : undefined
        }
      })
      if (error) throw error
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "GitHub sign-in failed"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in with email/password, magic link, or GitHub</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email and Password Form */}
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              className="w-full" 
              onClick={handleEmailPasswordSignIn} 
              disabled={loading || !email || !password}
            >
              Sign in
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">or</div>
          
          {/* Alternative Sign-In Methods */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleMagicLink} 
              disabled={loading || !email}
            >
              Send magic link
            </Button>
            <Button variant="outline" className="w-full" onClick={handleGithub} disabled={loading}>
              Continue with GitHub
            </Button>
          </div>
          <div className="text-center text-sm">
            <Link href="/signup">Create an account</Link> · <Link href="/">Back home</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}