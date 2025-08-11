# Refactoring Plan: Migrating to Supabase SSR

This document outlines the step-by-step plan to refactor the Next.js application to use the `@supabase/ssr` library. This will improve the architecture by enabling server-side rendering with authentication, leading to better performance and user experience.

---

## Phase 1: Setup and Configuration

### 1. Install the New Package

The first step is to add the `@supabase/ssr` library to the project's dependencies.

```bash
npm install @supabase/ssr
```

### 2. Update Environment Variables

Supabase SSR requires a new environment variable to handle the server-side auth flow securely. This variable must also be configured in the Vercel project settings.

- **File:** `.env.local`
- **Action:** Add the following variable. The value should be the absolute URL of your deployed application.

```
NEXT_PUBLIC_SUPABASE_REDIRECT_URI=http://localhost:3000/auth/callback
```

## Phase 2: Core Logic Refactoring

### 3. Create New Supabase Utility Modules

The existing Supabase client files in `src/lib/supabase` will be replaced with a new set of utilities that use the `@supabase/ssr` functions. It's a best practice to create these in a new directory, for example `src/utils/supabase`.

-   **`src/utils/supabase/client.ts`:** This will create a Supabase client for use in **Client Components**. It will use the `createBrowserClient` function from `@supabase/ssr`.

-   **`src/utils/supabase/server.ts`:** This will create a Supabase client for use in **Server Components, Server Actions, and Route Handlers**. It will use the `createServerClient` function from `@supabase/ssr`, which reads the auth cookie.

-   **`src/utils/supabase/middleware.ts`:** This will create a Supabase client specifically for use in the **Next.js Middleware**. It will use the `createMiddlewareClient` function.

### 4. Implement Server-Side Auth Flow

To handle logins and session management on the server, we need a new API route and updated middleware.

-   **Create Auth Callback Route:**
    -   **File:** `src/app/auth/callback/route.ts`
    -   **Purpose:** This route is where Supabase redirects the user after a successful login. Its job is to exchange the auth code for a session and save that session in a cookie.

-   **Update Middleware:**
    -   **File:** `src/middleware.ts`
    -   **Purpose:** The middleware will be updated to use the new Supabase middleware client. On every request, it will inspect the user's cookie and refresh their session if necessary. This ensures the user's auth state is always up-to-date on the server.

## Phase 3: Component and Page Refactoring

### 5. Refactor Auth Pages (`signin` & `signup`)

The client-side logic in the sign-in and sign-up pages will be replaced with **Server Actions**. 

-   **Files:** `src/app/signin/page.tsx`, `src/app/signup/page.tsx`
-   **Actions:**
    -   Create new files for server actions (e.g., `src/app/signin/actions.ts`).
    -   The `handleSignIn`, `handleSignUp`, etc., functions will be moved into these server actions.
    -   The forms on the pages will be updated to call these server actions instead of the old client-side functions.

### 6. Refactor the Todos Page

This is the most significant change. The goal is to convert the `/todos` page from a client-side-only experience to a server-rendered page.

-   **File:** `src/app/todos/page.tsx`
-   **Actions:**
    1.  **Convert to Server Component:** Remove the `'use client'` directive.
    2.  **Fetch Data on the Server:** The `useQuery` logic will be removed. Instead, we will create a server-side Supabase client directly within the `TodosPage` function and `await` the call to fetch the to-dos. The fetched data will be passed down as props to the client-side part of the component.
    3.  **Extract Client Logic:** The interactive parts of the page (the form, buttons, etc.) will be moved into a new Client Component (e.g., `src/app/todos/todos-client.tsx`). This new component will receive the server-fetched data as props.
    4.  **Refactor Mutations:** The `useMutation` hooks for adding, toggling, and deleting to-dos will be removed. This logic will be converted into **Server Actions** that can be called directly from the new client component.
    5.  **Optimistic UI (Optional but Recommended):** The new client component can still implement optimistic UI using React's `useOptimistic` hook in conjunction with the server actions.

---

Once this refactoring is complete, the application will be more performant, secure, and aligned with modern Next.js best practices.
