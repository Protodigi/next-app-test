'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
    const email = formData.get('email')
    const password = formData.get('password')
    
    // Input validation
    if (!email || !password) {
        return redirect('/signup?message=Email and password are required')
    }
    
    const emailStr = email.toString().trim()
    const passwordStr = password.toString().trim()
    
    if (!emailStr || !passwordStr) {
        return redirect('/signup?message=Email and password cannot be empty')
    }
    
    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailStr)) {
        return redirect('/signup?message=Please enter a valid email address')
    }
    
    // Password length validation
    if (passwordStr.length < 6) {
        return redirect('/signup?message=Password must be at least 6 characters')
    }
    
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
        email: emailStr,
        password: passwordStr,
    })

    if (error) {
        console.error(error)
        return redirect('/signup?message=Could not authenticate user')
    }

    return redirect('/signup?message=Check email to continue sign in process')
}
