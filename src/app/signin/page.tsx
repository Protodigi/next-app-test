import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signIn } from "./actions"

export default function SignInPage({ searchParams }: { searchParams?: { message?: string } }) {
  const message = searchParams?.message

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in to your account to access your todos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={signIn} className="space-y-3">
            <Input type="email" name="email" placeholder="you@example.com" required />
            <Input type="password" name="password" placeholder="Password" required />
            <Button className="w-full">Sign in</Button>
            {message && (
              <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                {message}
              </p>
            )}
          </form>
          <div className="text-center text-sm">
            <Link href="/signup">Create an account</Link> · <Link href="/">Back home</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
