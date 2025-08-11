import { render, screen } from '@testing-library/react'
import SignUpPage from '@/app/signup/page'

describe('SignUp Page', () => {
  it('renders the sign-up form', () => {
    // The new page is a Server Component, so we pass the searchParams prop.
    render(<SignUpPage searchParams={{ message: '' }} />)

    // Check that the main elements are present.
    expect(screen.getByRole('heading', { name: /Create account/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/^Password$/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create account/i })).toBeInTheDocument()
  })
})