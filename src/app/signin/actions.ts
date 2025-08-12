'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')
  
  // Input validation
  if (!email || !password) {
    return redirect('/signin?message=Email and password are required')
  }
  
  const emailStr = email.toString().trim()
  const passwordStr = password.toString().trim()
  
  if (!emailStr || !passwordStr) {
    return redirect('/signin?message=Email and password cannot be empty')
  }
  
  // Simple email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailStr)) {
    return redirect('/signin?message=Please enter a valid email address')
  }
  
  // Password length validation
  if (passwordStr.length < 6) {
    return redirect('/signin?message=Password must be at least 6 characters')
  }
  
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: emailStr,
    password: passwordStr,
  })

  if (error) {
    return redirect('/signin?message=Could not authenticate user')
  }

  return redirect('/todos')
}
