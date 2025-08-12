'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email')

  if (!email) {
    return redirect('/forgot-password?message=' + encodeURIComponent('Email is required'))
  }

  const emailStr = email.toString().trim()

  if (!emailStr) {
    return redirect('/forgot-password?message=' + encodeURIComponent('Email cannot be empty'))
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailStr)) {
    return redirect('/forgot-password?message=' + encodeURIComponent('Please enter a valid email address'))
  }

  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(emailStr, {
    redirectTo: `${new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    return redirect('/forgot-password?message=' + encodeURIComponent('Could not send password reset link'))
  }

  return redirect('/forgot-password?message=' + encodeURIComponent('Password reset link sent. Check your email.'))
}
