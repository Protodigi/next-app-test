'use client'
// This directive marks the component as a Client Component, which is necessary
// for using React hooks like useState, useEffect, and TanStack Query hooks.

import { useEffect, useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Plus, LogOut, Trash2 } from "lucide-react"
import { User } from "@supabase/supabase-js"

// --- TYPE DEFINITIONS ---

// Defines the structure of a single to-do item, matching the database schema.
// This ensures type safety throughout the component.
type Todo = {
  id: string
  user_id: string
  title: string
  completed: boolean
  inserted_at: string
}

// This is an optional but good practice type for defining the shape of the context
// object used in optimistic updates. It helps ensure we pass the correct data
// for rolling back changes on error.
type OptimisticContext = {
  previousTodos?: Todo[]
}

// This Next.js setting forces the page to be dynamically rendered, which is important
// for pages with user-specific, frequently changing data.
export const dynamic = "force-dynamic"

// --- COMPONENT DEFINITION ---

export default function TodosPage() {
  // Get the QueryClient instance from the context provided by QueryClientProvider.
  // This client is the core of TanStack Query, managing all caching and data operations.
  const queryClient = useQueryClient()

  // Local state for the new to-do input field. This is UI state, not server state,
  // so it's appropriately handled by useState.
  const [newTitle, setNewTitle] = useState("")

  // Memoize the Supabase client instance to prevent it from being recreated on every render.
  const supabase = useMemo(() => getSupabaseBrowser(), [])

  // Local state to hold the authenticated user object. This is necessary because
  // user data is needed for database queries.
  const [user, setUser] = useState<User | null>(null)

  // --- DATA FETCHING with useQuery ---
  // `useQuery` is the primary hook for fetching and caching data from the server.
  const { data: todos = [], isLoading } = useQuery<Todo[]>(
    {
      // `queryKey` is a unique identifier for this query. TanStack Query uses it for caching.
      // Any time this key changes, the query will be refetched.
      queryKey: ['todos'],

      // `queryFn` is the asynchronous function that performs the data fetching.
      // It must return a promise that resolves with the data or throws an error.
      queryFn: async () => {
        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .order("inserted_at", { ascending: false })
        if (error) throw new Error(error.message)
        return data
      },

      // The `enabled` option provides powerful control over when a query runs.
      // Here, we prevent the query from running until the user object has been fetched,
      // avoiding a pointless request before authentication is confirmed.
      enabled: !!user,
    }
  )

  // --- DATA MUTATIONS with useMutation ---
  // `useMutation` is used for creating, updating, or deleting data.
  // It provides helper states and functions to manage the lifecycle of a mutation.

  // ADD TODO MUTATION
  const { mutate: addTodo } = useMutation(
    {
      // `mutationFn` is the async function that performs the actual mutation.
      mutationFn: async (title: string) => {
        if (!user) throw new Error("User not authenticated")
        const { data, error } = await supabase
          .from("todos")
          .insert({ title, user_id: user.id })
          .select() // .select().single() is used to get the newly created row back
          .single()
        if (error) throw new Error(error.message)
        return data
      },

      // `onMutate` is the core of the optimistic update. It runs *before* the mutationFn.
      onMutate: async (newTitle: string) => {
        // 1. Cancel any outgoing refetches for the 'todos' query. This prevents
        //    stale data from the server from overwriting our optimistic update.
        await queryClient.cancelQueries({ queryKey: ['todos'] })

        // 2. Snapshot the previous state from the cache. This is our rollback point.
        const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

        // 3. Create the new to-do optimistically. We use a temporary ID for the key.
        const optimisticTodo: Todo = {
          id: `temp-${Date.now()}`,
          title: newTitle,
          completed: false,
          user_id: user!.id,
          inserted_at: new Date().toISOString(),
        }

        // 4. Immediately update the cache with the new, optimistic data.
        //    This makes the UI update instantly.
        queryClient.setQueryData<Todo[]>(['todos'], (old = []) => [
          optimisticTodo,
          ...old,
        ])

        // 5. Return the snapshot. This will be passed as `context` to onError and onSettled.
        return { previousTodos }
      },

      // `onError` is triggered if the mutationFn throws an error.
      onError: (err, newTodo, context) => {
        toast.error("Failed to add to-do.")
        // If the mutation fails, we roll back the UI to the previous state using our snapshot.
        if (context?.previousTodos) {
          queryClient.setQueryData(['todos'], context.previousTodos)
        }
      },

      // `onSettled` runs after the mutation is either successful or has failed.
      onSettled: () => {
        // We always refetch the 'todos' query to ensure the client state is in sync
        // with the server state. This replaces our optimistic to-do with the real one
        // from the database (which has the correct ID).
        queryClient.invalidateQueries({ queryKey: ['todos'] })
      },
    }
  )

  // TOGGLE TODO MUTATION (Follows the same optimistic update pattern)
  const { mutate: toggleTodo } = useMutation(
    {
      mutationFn: async (todo: Todo) => {
        const { error } = await supabase
          .from("todos")
          .update({ completed: !todo.completed })
          .eq("id", todo.id)
        if (error) throw new Error(error.message)
      },
      onMutate: async (updatedTodo: Todo) => {
        await queryClient.cancelQueries({ queryKey: ['todos'] })
        const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
        // Optimistically find and update the specific to-do in the cache.
        queryClient.setQueryData<Todo[]>(['todos'], (old = []) =>
          old.map((todo) =>
            todo.id === updatedTodo.id
              ? { ...todo, completed: !todo.completed }
              : todo
          )
        )
        return { previousTodos }
      },
      onError: (err, newTodo, context) => {
        toast.error("Failed to update to-do.")
        if (context?.previousTodos) {
          queryClient.setQueryData(['todos'], context.previousTodos)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] })
      },
    }
  )

  // DELETE TODO MUTATION (Follows the same optimistic update pattern)
  const { mutate: deleteTodo } = useMutation(
    {
      mutationFn: async (todoId: string) => {
        const { error } = await supabase.from("todos").delete().eq("id", todoId)
        if (error) throw new Error(error.message)
      },
      onMutate: async (deletedId: string) => {
        await queryClient.cancelQueries({ queryKey: ['todos'] })
        const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
        // Optimistically filter the deleted to-do out of the cache.
        queryClient.setQueryData<Todo[]>(['todos'], (old = []) =>
          old.filter((todo) => todo.id !== deletedId)
        )
        return { previousTodos }
      },
      onError: (err, newTodo, context) => {
        toast.error("Failed to delete to-do.")
        if (context?.previousTodos) {
          queryClient.setQueryData(['todos'], context.previousTodos)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] })
      },
    }
  )

  // --- EFFECTS & EVENT HANDLERS ---

  // This effect runs once on component mount to check for an authenticated user.
  // If no user is found, it redirects to the sign-in page.
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        window.location.href = "/signin"
      } else {
        setUser(data.user)
      }
    }
    getUser()
  }, [supabase])

  // Wrapper function to handle the form submission for adding a new to-do.
  const handleAddTodo = () => {
    if (!newTitle.trim()) return
    addTodo(newTitle.trim())
    setNewTitle("")
  }

  // Handles signing the user out and redirecting to the home page.
  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  // A derived state calculation to show the count of remaining to-dos.
  const remaining = todos.filter((t) => !t.completed).length

  // --- JSX RENDER ---

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url("/images/app-bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>DK TO DO</CardTitle>
            <CardDescription>
              {/* Display a loading state while the initial data is being fetched */}
              {isLoading ? "Loading..." : `${remaining} remaining`}
            </CardDescription>
          </div>
          <Button variant="secondary" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out{user?.email ? ` (${user.email})` : ""}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              id="new-todo"
              name="new-todo"
              placeholder="Add a new task"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
            />
            <Button onClick={handleAddTodo}>
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>

          <Separator className="my-4" />

          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                // Optimistic UI styling: temporary items are semi-transparent
                className={`flex items-center justify-between rounded-md border p-3 bg-card/50 ${
                  todo.id.startsWith('temp-') ? 'opacity-50' : ''
                }`}>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo)}
                  />
                  <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
                    {todo.title}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
            {/* Show a message if there are no todos and we are not in a loading state */}
            {!isLoading && todos.length === 0 && (
              <li className="text-center text-sm text-muted-foreground">No todos yet</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </main>
  )
}
