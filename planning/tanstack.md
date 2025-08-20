# Tanstack Refactor Plan

This document outlines the process of refactoring the application to use the Tanstack suite of libraries for improved state management, data display, and form handling.

## Phase 1: Tanstack Query & Tanstack Table

### 1. Installation (Completed)

- `@tanstack/react-query`
- `@tanstack/react-table`
- `@tanstack/react-query-devtools`

*Note: `@tanstack/react-form` was deferred due to dependency conflicts with the current Vite version used for testing.*

### 2. Tanstack Query Setup

- **Objective:** Centralize server state management, replacing manual `useEffect` fetching with `useQuery` for caching and performance.
- **Steps:**
    - Create a `QueryClient` instance.
    - Wrap the main application layout in a `QueryClientProvider`.
    - Add `ReactQueryDevtools` for debugging.

### 3. Todos Page Refactor (`/todos`)

- **Objective:** Overhaul the todos feature to use Tanstack Query for data fetching/mutations and Tanstack Table for display.

#### Data Fetching (`useQuery`)
- Replace the current data fetching logic in `todos-client.tsx` with a `useQuery` hook.
- **Query Key:** `['todos']`
- **Query Function:** An async function that uses the Supabase client to fetch all todos.

#### Data Mutations (`useMutation`)
- Wrap the existing Server Actions (`addTodo`, `updateTodo`, `deleteTodo`) in `useMutation` hooks.
- On success, invalidate the `['todos']` query to trigger an automatic refetch and keep the UI in sync.

#### Data Display (`useReactTable`)
- Create a `columns.ts` file to define the table structure for a "todo" item.
- Columns will include:
    - A checkbox for the "completed" status.
    - The task description.
    - An "actions" column with buttons for editing and deleting.
- Use the `useReactTable` hook in `todos-client.tsx` to manage the table state.
- Render the table using existing `shadcn/ui` components (`<Card>`, `<Table>`, `<Checkbox>`, `<Button>`) to maintain visual consistency.

---

**Timestamp:** (Manual entry, as dynamic timestamps are not supported)

**Change:** Modified Server Actions in `src/app/todos/actions.ts`

- **Removed `redirect()` calls:** The actions no longer handle navigation. This is now the responsibility of the client-side component, which is better for a Single Page Application (SPA) feel.
- **Return Data on Success:** The `addTodo` action now returns the newly created todo object from the database. This allows the client to get the server-assigned ID and timestamp immediately.
- **Throw Errors on Failure:** Instead of redirecting with an error message, the actions now `throw new Error()`. This provides a clear error to the `useMutation` hook on the client, allowing for proper error handling and state management.

---

**Timestamp:** (Manual entry, as dynamic timestamps are not supported)

**Change:** Implemented Hybrid SSR with a dedicated Provider

- **Created `src/app/todos/todos-provider.tsx`:** This new client component is now responsible for creating the `QueryClient` instance and wrapping the `todos` feature with the `QueryClientProvider` and `HydrationBoundary`. This isolates the query state to the specific feature that needs it.
- **Updated `src/app/todos/page.tsx`:** The server component now prefetches the data and passes the `dehydratedState` to the new `TodosProvider`, which wraps the `TodosClient`.
- **Cleaned up `src/app/providers.tsx`:** Removed the global `QueryClientProvider` and `HydrationBoundary` to avoid conflicts and keep the main provider clean.

---

**Timestamp:** (Manual entry, as dynamic timestamps are not supported)

**Change:** Completed the refactor of `todos-client.tsx` and `columns.tsx`

- **`todos-client.tsx`:**
    - Replaced all `useState` and `useOptimistic` logic with `useQuery` and `useMutation` hooks from Tanstack Query.
    - Implemented `useReactTable` to manage the data grid.
    - The UI is now rendered as a `<table>` using `shadcn/ui` components.
    - Added toast notifications from `sonner` for user feedback on mutation success or failure.
    - Passed the mutation functions to the table instance via the `meta` option.
- **`columns.tsx`:**
    - The table columns now access the mutation functions from the `table.options.meta` object.
    - The checkbox and delete button are now fully functional, triggering the respective mutations.
- **`types/table.d.ts`:**
    - Created a new type definition file to extend the `TableMeta` interface, providing type safety for the functions passed in the `meta` object.

---

## Detailed Breakdown of Changes

### From `useOptimistic` to `useMutation`

The original implementation used React's `useOptimistic` hook to provide immediate feedback to the user. This is a great feature, but Tanstack Query's `useMutation` provides a more powerful and integrated way to handle optimistic updates, especially when dealing with server-side state.

**Before (`todos-client.tsx`):**

```tsx
const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    todos,
    (state, { action, todo }: { action: 'add' | 'delete' | 'toggle', todo: any }) => {
        // ... logic to manually update the state
    }
)

const handleFormSubmit = async (formData: FormData) => {
    // ...
    setOptimisticTodos({ action: 'add', todo: { /* ... */ } })
    await addTodo(formData)
}
```

**After (`todos-client.tsx`):**

```tsx
const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: (newTodo) => {
        queryClient.setQueryData(['todos'], (oldTodos: Todo[] = []) => [...oldTodos, newTodo])
        toast.success("Todo added successfully!")
        formRef.current?.reset()
    },
    onError: (error) => {
        toast.error(`Failed to add todo: ${error.message}`)
    },
})

const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    addTodoMutation.mutate(formData)
}
```

### Hybrid SSR with `HydrationBoundary`

To maintain the benefits of SSR while using a client-side data fetching library, we implemented a hybrid approach. The server prefetches the data, and the client hydrates the cache with that data.

**`todos/page.tsx` (Server Component):**

```tsx
export default async function TodosPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: /* ... fetch data ... */,
  })

  return (
      <TodosProvider dehydratedState={dehydrate(queryClient)}>
        <TodosClient userEmail={user.email ?? null} />
      </TodosProvider>
  )
}
```

**`todos/todos-provider.tsx` (Client Component):**

```tsx
export default function TodosProvider({ children, dehydratedState }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </HydrationBoundary>
    </QueryClientProvider>
  )
}
```

### Tanstack Table and `meta` for Actions

Instead of passing mutation functions down as props, we used the `meta` option in `useReactTable` to provide the column definitions with access to the mutations.

**`todos-client.tsx`:**

```tsx
const table = useReactTable({
    data: todos ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
        toggleTodo: toggleTodoMutation.mutate,
        deleteTodo: deleteTodoMutation.mutate,
    }
})
```

**`columns.tsx`:**

```tsx
// ...
cell: ({ row, table }) => (
  <Checkbox
    checked={row.original.completed}
    onCheckedChange={() => {
        table.options.meta?.toggleTodo(row.original.id, row.original.completed)
    }}
    aria-label="Select row"
  />
),
// ...
```
