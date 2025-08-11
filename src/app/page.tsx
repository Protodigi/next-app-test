import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * The main landing page of the application.
 * It serves as a welcome screen and provides navigation to the main app (`/todos`)
 * or the sign-in page.
 */
export default function HomePage() {
  return (
    // This main element is styled to be a full-screen container that centers its content.
    // It uses the dark theme variant and has a background image applied.
    <main
      className="dark min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url("/images/app-bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* A Card component serves as a container for the page content. */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Supabase Todos</CardTitle>
          <CardDescription>Beautiful to-do app with auth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {/* 
              The `asChild` prop on the Button component is a feature of ShadCN.
              It tells the Button to not render its own `<button>` element, but instead
              to pass its properties and styles to its direct child component.
              Here, it passes them to the `<Link>` component, making the link look and feel like a button.
            */}
            <Button asChild className="w-full">
              <Link href="/todos">Open App</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}