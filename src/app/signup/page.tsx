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
 * The sign-up page for new users to create an account using their email and a password.
 */
export default function SignUpPage() {
  // Local state variables to manage the form inputs and loading status.
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("") // State for the password confirmation field.
  const [loading, setLoading] = useState(false)

  /**
   * Handles the user registration process.
   */
  const handleSignUp = async () => {
    // Basic form validation.
    if (!email || !password) {
      toast.error("Email and password are required")
      return
    }
    if (password !== confirm) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)
    const supabase = getSupabaseBrowser()
    try {
      // Use Supabase's `signUp` method to create a new user.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // If email confirmation is required, the user will be redirected to this
          // URL after clicking the confirmation link in their email.
          emailRedirectTo:
            typeof window !== "undefined" ? `${window.location.origin}/todos` : undefined
        }
      })
      if (error) throw error

      // Supabase returns different states depending on whether email confirmation is enabled.
      if (data.user && !data.session) {
        // This case means email confirmation is required. The user object is created,
        // but a session is not established until the email is confirmed.
        toast.success("Check your email to confirm your account")
      } else {
        // This case means email confirmation might be disabled, or the user is already confirmed.
        // The user is successfully signed in, so we redirect them.
        toast.success("Account created. Redirecting...")
        window.location.href = "/todos"
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign up failed"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Sign up with email and password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <Button className="w-full" onClick={handleSignUp} disabled={loading}>
            Create account
          </Button>
          <div className="text-center text-sm">
            Already have an account? <Link href="/signin">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}