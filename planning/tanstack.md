# TanStack Query Implementation Plan

This document outlines the strategy for refactoring the application to use TanStack Query (v5) for server state management, incorporating an optimistic UI pattern for all to-do operations.

## 1. Installation

Install the necessary packages:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

## 2. Provider Setup

To make TanStack Query available throughout the app, we will set up a client provider.

- **File:** `src/app/providers.tsx`
- **Actions:**
  1.  Create a single `QueryClient` instance.
  2.  Wrap the existing `Toaster` component with `<QueryClientProvider>`.
  3.  Include `<ReactQueryDevtools initialIsOpen={false} />` within the provider to enable the debugging tools in development.

## 3. Refactoring `src/app/todos/page.tsx`

This is the core of the refactor. We will replace the existing `useState`-based logic with TanStack Query hooks.

### Data Fetching (`useQuery`)

-   **Remove State:** The `useState` for `todos` and `loading` will be removed.
-   **Query Definition:**
    -   `queryKey`: `['todos']`
    -   `queryFn`: An `async` function that calls `supabase.from('todos').select().order(...)` to fetch the data.
-   **Hook Usage:** `const { data: todos, isLoading } = useQuery({ queryKey, queryFn })`

### Data Mutations (`useMutation`)

We will create three separate `useMutation` hooks for adding, toggling, and deleting to-dos. All will follow the optimistic update pattern.

#### Add To-Do

-   `mutationFn`: Takes a `newTitle` string and calls `supabase.from('todos').insert(...)`.
-   `onMutate`: This is the optimistic update step.
    1.  Cancel any outgoing `todos` queries to prevent them from overwriting our optimistic update.
    2.  Get the current list of todos from the query cache via `queryClient.getQueryData(['todos'])`.
    3.  Create a new to-do object with a temporary ID (e.g., `Date.now()`) and the `newTitle`.
    4.  Add this new to-do to the beginning of the list.
    5.  Update the cache with `queryClient.setQueryData(['todos'], newList)`.
    6.  Return the previous list as context for potential rollback.
-   `onError`: If the mutation fails, use the context from `onMutate` to roll back the UI by setting the query data to the previous list.
-   `onSettled`: Always invalidate the `todos` query (`queryClient.invalidateQueries(['todos'])`) to re-fetch the latest data from the server. This ensures the temporary to-do is replaced with the real one from the database (with the correct ID and timestamp).

#### Toggle To-Do

-   `mutationFn`: Takes a `todo` object and calls `supabase.from('todos').update({ completed: !todo.completed })`.
-   `onMutate`: Similar to adding, but instead of adding to the list, we will find the specific to-do in the query cache and update its `completed` property.
-   `onError` & `onSettled`: Same rollback and re-fetching logic as the add mutation.

#### Delete To-Do

-   `mutationFn`: Takes a `todoId` and calls `supabase.from('todos').delete()`.
-   `onMutate`: Find the to-do in the query cache and filter it out of the list.
-   `onError` & `onSettled`: Same rollback and re-fetching logic.

## 4. Changelog

After the implementation is complete and verified, a new entry will be added to `changelog.md` documenting the refactor.
