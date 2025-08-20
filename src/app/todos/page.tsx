import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import TodosClient from './todos-client'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import TodosProvider from './todos-provider'

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
  const queryClient = new QueryClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/signin')
  }

  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('todos').select().order('inserted_at', { ascending: false })
      if (error) {
        throw error
      }
      return data
    },
  })

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url("/images/app-bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <TodosProvider dehydratedState={dehydrate(queryClient)}>
        <TodosClient userEmail={user.email ?? null} />
      </TodosProvider>
    </main>
  )
}