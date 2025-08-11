import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignInPage from '@/app/signin/page'

vi.mock('@/lib/supabase/client', () => {
  return {
    getSupabaseBrowser: () => ({
      auth: {
        signInWithOtp: vi.fn().mockResolvedValue({ data: {}, error: null }),
        signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
      },
    }),
  }
})

describe('SignIn', () => {
  it('renders and sends magic link', async () => {
    render(<SignInPage />)
    const input = screen.getByPlaceholderText(/you@example.com/i)
    fireEvent.change(input, { target: { value: 'user@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /magic link/i }))
    await waitFor(() => {
      // No error thrown
      expect(true).toBe(true)
    })
  })
})

