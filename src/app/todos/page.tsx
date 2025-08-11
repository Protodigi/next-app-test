import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import TodosClient from './todos-client'

export const dynamic = 'force-dynamic'

// Define the type for a Todo item, making it available to the client component.
export type Todo = {
  id: string
  user_id: string
  title: string
  completed: boolean
  inserted_at: string
}

export default async function TodosPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/signin')
  }

  const { data: todos } = await supabase.from('todos').select().order('inserted_at', { ascending: false })

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url("/images/app-bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <TodosClient todos={todos ?? []} userEmail={user.email ?? null} />
    </main>
  )
}