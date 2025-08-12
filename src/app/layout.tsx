import "@/app/globals.css" // Imports the global stylesheet, which contains the Tailwind directives and theme variables.
import { ReactNode } from "react"
import Providers from "./providers" // Imports the central provider component.

/**
 * `metadata` is a special Next.js object that is used to define the metadata for this layout,
 * such as the page title and description. This improves SEO.
 */
export const metadata = {
  title: "Supabase Todos",
  description: "Next.js + Supabase + shadcn/ui"
}

/**
 * This is the root layout for the entire application. It's a server component by default.
 * It sets up the basic HTML document structure (`<html>`, `<body>`) and wraps all page content
 * with the central `Providers` component.
 * @param {ReactNode} children - This prop will be the page component that Next.js renders for the current route.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* 
          The Providers component wraps the entire application, making essential services
          like Sonner (for toasts) available to all pages.
          The `children` prop here is the actual page content being rendered.
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}