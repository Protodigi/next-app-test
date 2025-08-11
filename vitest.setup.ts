import '@testing-library/jest-dom'

// Mock Next.js router if needed in components
vi.mock('next/link', async () => {
  const React = await import('react')
  return {
    default: React.forwardRef<HTMLAnchorElement, any>(
      ({ href, children, ...props }, ref) => (
        <a ref={ref} href={href as any} {...props}>
          {children}
        </a>
      )
    )
  }
})

// Env vars for tests
process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key'

