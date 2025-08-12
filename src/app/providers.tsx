'use client'
// This file is designated as a Client Component because it uses React hooks
// and provides context that is only relevant on the client side.

import { Toaster } from "sonner" // A library for showing toast notifications

/**
 * This component acts as a central provider for various contexts used throughout the application.
 * Wrapping the main layout with this component ensures that all pages and components
 * have access to the services it provides, like Sonner's toast notifications.
 * @param {React.ReactNode} children - The child components that will be rendered within these providers.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* The Toaster component from the 'sonner' library. It doesn't render anything visible
          itself, but it provides the system needed to show toast notifications when you call
          `toast()` from other components. */}
      <Toaster richColors position="top-right" />

      {/* This renders the actual page or layout content of the application. */}
      {children}
    </>
  )
}