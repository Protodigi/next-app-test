// This Next.js setting forces the layout and its children to be dynamically rendered on the server.
// This is useful for pages that contain dynamic, user-specific content.
export const dynamic = "force-dynamic"

/**
 * A simple layout component specifically for the /todos route and any potential sub-routes.
 * In this case, it doesn't add any extra UI elements and just renders the children.
 * This file is useful if you wanted to add a shared header, footer, or sidebar
 * that only appears on the to-do related pages.
 * @param {React.ReactNode} children - This will be the page component for the specific route (e.g., `todos/page.tsx`).
 */
export default function TodosLayout({ children }: { children: React.ReactNode }) {
  // It simply returns the child components passed to it without adding any extra layout structure.
  return children
}