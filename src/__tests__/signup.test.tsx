import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUpPage from '@/app/signup/page'

const signUp = vi.fn().mockResolvedValue({ data: { user: { id: 'u1' }, session: {}} , error: null })

vi.mock('@/lib/supabase/client', () => {
  return {
    getSupabaseBrowser: () => ({
      auth: { signUp },
    }),
  }
})

describe('SignUp', () => {
  it('creates account with email/password', async () => {
    render(<SignUpPage />)
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: 'user@example.com' } })
    fireEvent.change(screen.getByPlaceholderText(/^Password$/), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByPlaceholderText(/Confirm password/), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => expect(signUp).toHaveBeenCalled())
  })
})

