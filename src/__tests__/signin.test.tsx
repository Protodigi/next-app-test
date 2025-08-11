import { render, screen } from '@testing-library/react'
import SignInPage from '@/app/signin/page'

describe('SignIn Page', () => {
  it('renders the sign-in form', () => {
    // The new page is a Server Component, so we pass the searchParams prop.
    render(<SignInPage searchParams={{ message: '' }} />)

    // Check that the main elements are present.
    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument()
  })
})