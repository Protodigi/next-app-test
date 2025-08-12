'use server'

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function updatePassword(formData: FormData) {
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')
  const code = formData.get('code')

  if (!code) {
    return redirect('/update-password?message=' + encodeURIComponent('Missing authorization code'))
  }

  // Validate authorization code format and length
  const codeStr = code.toString()
  if (typeof codeStr !== 'string' || codeStr.length === 0) {
    return redirect('/update-password?message=' + encodeURIComponent('Invalid authorization code format'))
  }
  
  // Validate code pattern - only allow alphanumeric, hyphens, and underscores
  const codeRegex = /^[A-Za-z0-9\-_]+$/
  if (!codeRegex.test(codeStr)) {
    return redirect('/update-password?message=' + encodeURIComponent('Invalid authorization code format'))
  }
  
  // Set reasonable max length for authorization codes
  if (codeStr.length > 100) {
    return redirect('/update-password?message=' + encodeURIComponent('Authorization code too long'))
  }

  if (!password || !confirmPassword) {
    return redirect('/update-password?message=' + encodeURIComponent('Password and confirm password are required'))
  }

  const passwordStr = password.toString().trim()
  const confirmPasswordStr = confirmPassword.toString().trim()

  if (passwordStr !== confirmPasswordStr) {
    return redirect('/update-password?message=' + encodeURIComponent('Passwords do not match'))
  }

  if (passwordStr.length < 6) {
    return redirect('/update-password?message=' + encodeURIComponent('Password must be at least 6 characters'))
  }

  const supabase = createServerClient()
  
  try {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(codeStr)

    if (exchangeError) {
      return redirect('/update-password?message=' + encodeURIComponent('Invalid or expired authorization code'))
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: passwordStr })

    if (updateError) {
      return redirect('/update-password?message=' + encodeURIComponent('Could not update password'))
    }

    return redirect('/signin?message=' + encodeURIComponent('Password updated successfully. You can now sign in.'))
  } catch (error) {
    console.error('Error during password update:', error)
    return redirect('/update-password?message=' + encodeURIComponent('An unexpected error occurred'))
  }
}
