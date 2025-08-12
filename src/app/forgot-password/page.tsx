import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { forgotPassword } from "./actions"

export default function ForgotPasswordPage({ 
  searchParams 
}: { 
  searchParams?: Record<string, string | string[] | undefined> 
}) {
  const message = Array.isArray(searchParams?.message) ? searchParams.message[0] : (searchParams?.message ?? '')

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={forgotPassword} className="space-y-3">
            <Input type="email" name="email" placeholder="you@example.com" required />
            <Button type="submit" className="w-full">Send Reset Link</Button>
            {message && (
              <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                {message}
              </p>
            )}
          </form>
          <div className="text-center text-sm">
            <Link href="/signin">Back to Sign In</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
