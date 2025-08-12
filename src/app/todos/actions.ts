'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addTodo(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/signin?message=' + encodeURIComponent('Please sign in to add todos'))
    }

    const title = formData.get('title')
    if (!title) {
        return redirect('/todos?message=' + encodeURIComponent('Todo title is required'))
    }

    const titleStr = title.toString().trim()
    if (!titleStr) {
        return redirect('/todos?message=' + encodeURIComponent('Todo title cannot be empty'))
    }

    if (titleStr.length > 500) {
        return redirect('/todos?message=' + encodeURIComponent('Todo title is too long (max 500 characters)'))
    }

    const { error } = await supabase.from('todos').insert({ 
        title: titleStr, 
        user_id: user.id 
    })
    
    if (error) {
        console.error('Error adding todo:', error)
        return redirect('/todos?message=' + encodeURIComponent('Failed to add todo'))
    }
    
    revalidatePath('/todos')
    redirect('/todos')
}

export async function toggleTodo(id: string, completed: boolean) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/signin?message=' + encodeURIComponent('Please sign in to update todos'))
    }

    const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only toggle their own todos
    
    if (error) {
        console.error('Error toggling todo:', error)
        return redirect('/todos?message=' + encodeURIComponent('Failed to update todo'))
    }
    
    revalidatePath('/todos')
    redirect('/todos')
}

export async function deleteTodo(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/signin?message=' + encodeURIComponent('Please sign in to delete todos'))
    }

    const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only delete their own todos
    
    if (error) {
        console.error('Error deleting todo:', error)
        return redirect('/todos?message=' + encodeURIComponent('Failed to delete todo'))
    }
    
    revalidatePath('/todos')
    redirect('/todos')
}
