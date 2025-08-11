'use client'
// This file is designated as a Client Component because it uses React hooks (useState)
// and provides context that is only relevant on the client side.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"
import { Toaster } from "sonner" // A library for showing toast notifications

/**
 * This component acts as a central provider for various contexts used throughout the application.
 * Wrapping the main layout with this component ensures that all pages and components
 * have access to the services it provides, like TanStack Query's cache and Sonner's toast notifications.
 * @param {React.ReactNode} children - The child components that will be rendered within these providers.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  // The `useState` hook is used here to create and memoize the QueryClient instance.
  // By initializing the client inside useState, we ensure that a *single* instance of QueryClient
  // is created and reused for the entire lifecycle of the application. This is crucial for
  // maintaining a consistent cache.
  const [queryClient] = useState(() => new QueryClient())

  return (
    // The QueryClientProvider makes the QueryClient instance available to all child components
    // via React's context API. Any component under this provider can now use hooks like `useQuery`.
    <QueryClientProvider client={queryClient}>
      {/* The Toaster component from the 'sonner' library. It doesn't render anything visible
          itself, but it provides the system needed to show toast notifications when you call
          `toast()` from other components. */}
      <Toaster richColors position="top-right" />

      {/* This renders the actual page or layout content of the application. */}
      {children}

      {/* The ReactQueryDevtools component provides a powerful debugging tool for TanStack Query.
          It is only included in development builds and is stripped out in production.
          `initialIsOpen={false}` means the devtools panel will be closed by default. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}