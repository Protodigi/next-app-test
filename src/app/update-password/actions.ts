'use server'

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updatePassword(formData: FormData) {
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')
  const code = formData.get('code')

  if (!code) {
    return redirect('/update-password?message=Missing authorization code')
  }

  if (!password || !confirmPassword) {
    return redirect(`/update-password?code=${code}&message=Password and confirm password are required`)
  }

  const passwordStr = password.toString().trim()
  const confirmPasswordStr = confirmPassword.toString().trim()

  if (passwordStr !== confirmPasswordStr) {
    return redirect(`/update-password?code=${code}&message=Passwords do not match`)
  }

  if (passwordStr.length < 6) {
    return redirect(`/update-password?code=${code}&message=Password must be at least 6 characters`)
  }

  const supabase = createServerClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code.toString())

  if (exchangeError) {
    return redirect(`/update-password?code=${code}&message=Invalid or expired authorization code`)
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: passwordStr })

  if (updateError) {
    return redirect(`/update-password?code=${code}&message=Could not update password`)
  }

  return redirect('/signin?message=Password updated successfully. You can now sign in.')
}
