'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTodo(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Please sign in to add todos')
    }

    const title = formData.get('title')
    if (!title) {
        throw new Error('Todo title is required')
    }

    const titleStr = title.toString().trim()
    if (!titleStr) {
        throw new Error('Todo title cannot be empty')
    }

    if (titleStr.length > 500) {
        throw new Error('Todo title is too long (max 500 characters)')
    }

    const { data, error } = await supabase.from('todos').insert({ 
        title: titleStr, 
        user_id: user.id 
    }).select().single()
    
    if (error) {
        console.error('Error adding todo:', error)
        throw new Error('Failed to add todo')
    }
    
    revalidatePath('/todos')
    return data
}

export async function toggleTodo(id: string, completed: boolean) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Please sign in to update todos')
    }

    const { error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only toggle their own todos
    
    if (error) {
        console.error('Error toggling todo:', error)
        throw new Error('Failed to update todo')
    }
    
    revalidatePath('/todos')
}

export async function deleteTodo(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Please sign in to delete todos')
    }

    const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only delete their own todos
    
    if (error) {
        console.error('Error deleting todo:', error)
        throw new Error('Failed to delete todo')
    }
    
    revalidatePath('/todos')
}
