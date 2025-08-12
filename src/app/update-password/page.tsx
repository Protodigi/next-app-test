import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { updatePassword } from "./actions"

export default function UpdatePasswordPage({ 
  searchParams 
}: { 
  searchParams?: Record<string, string | string[] | undefined> 
}) {
  const message = Array.isArray(searchParams?.message) ? searchParams.message[0] : (searchParams?.message ?? '')
  const code = Array.isArray(searchParams?.code) ? searchParams.code[0] : (searchParams?.code ?? '')

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={updatePassword} className="space-y-3">
            <input type="hidden" name="code" value={code || ''} />
            <Input type="password" name="password" placeholder="New Password" required />
            <Input type="password" name="confirmPassword" placeholder="Confirm New Password" required />
            <Button type="submit" className="w-full" disabled={!code}>
              Update Password
            </Button>
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
