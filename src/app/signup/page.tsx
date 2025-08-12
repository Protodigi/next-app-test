import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signup } from "./actions"

export default function SignUpPage({ 
  searchParams 
}: { 
  searchParams?: Record<string, string | string[] | undefined> 
}) {
  const message = Array.isArray(searchParams?.message) ? searchParams.message[0] : (searchParams?.message ?? '')

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Sign up with email and password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form action={signup} className="space-y-3">
            <Input type="email" name="email" placeholder="you@example.com" required />
            <Input type="password" name="password" placeholder="Password" required />
            <Button type="submit" className="w-full">Create account</Button>
            {message && (
              <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                {message}
              </p>
            )}
          </form>
          <div className="text-center text-sm">
            Already have an account? <Link href="/signin">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
