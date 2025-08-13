
# Debugging Log

## 2025-08-13

**Issue:** Signout component in /todos route is leading to a 404 error after Supabase SSR refactor.

**Analysis:** The signout button was implemented as a form POSTing to `/auth/signout`, but this route was not defined. The `@supabase/ssr` package requires explicit server-side routes or actions for authentication operations.

**Solution:**

1.  **Created a Server Action:** A new server action was created at `src/app/auth/signout/actions.ts` to handle the sign-out logic. This action uses the Supabase server client to sign the user out and then redirects them to the `/signin` page.

    ```typescript
    // src/app/auth/signout/actions.ts
    'use server'
    import { createClient } from '@/utils/supabase/server'
    import { redirect } from 'next/navigation'

    export async function signOut() {
      const supabase = createClient()
      await supabase.auth.signOut()
      return redirect('/signin')
    }
    ```

2.  **Updated the Client Component:** The sign-out button in `src/app/todos/todos-client.tsx` was updated to use the new `signOut` server action.

    ```tsx
    // src/app/todos/todos-client.tsx
    import { signOut } from '@/app/auth/signout/actions'
    ...
    <form action={signOut}>
        <Button variant="secondary" type="submit">
            <LogOut className="h-4 w-4 mr-2" /> Sign out{userEmail ? ` (${userEmail})` : ""}
        </Button>
    </form>
    ```
