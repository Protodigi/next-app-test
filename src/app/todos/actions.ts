'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTodo(formData: FormData) {
    const title = formData.get('title') as string
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const { error } = await supabase.from('todos').insert({ title, user_id: user.id })
        if (error) {
            console.error(error)
            // handle error
        }
    }
    revalidatePath('/todos')
}

export async function toggleTodo(id: string, completed: boolean) {
    const supabase = createClient()
    const { error } = await supabase.from('todos').update({ completed: !completed }).eq('id', id)
    if (error) {
        console.error(error)
        // handle error
    }
    revalidatePath('/todos')
}

export async function deleteTodo(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (error) {
        console.error(error)
        // handle error
    }
    revalidatePath('/todos')
}
