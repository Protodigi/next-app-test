import '@testing-library/jest-dom'
import React from 'react'

// Mock Next.js router/link where needed
vi.mock('next/link', () => ({
  default: React.forwardRef<HTMLAnchorElement, any>(
    ({ href, children, ...props }, ref) => (
      <a ref={ref as any} href={href as any} {...props}>
        {children}
      </a>
    )
  )
}))

// Env vars for tests
process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key'

// Stub window navigation to avoid jsdom "navigation not implemented" errors
const testUrl = new URL('http://localhost/')
Object.defineProperty(window, 'location', {
  configurable: true,
  value: {
    ...testUrl,
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    get href() {
      return testUrl.toString()
    },
    set href(_v: string) {
      // swallow in tests
    },
  },
})

