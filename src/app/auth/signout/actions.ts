'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error.message)
    throw new Error(`Failed to sign out: ${error.message}`)
  }
  
  redirect('/signin')
}
