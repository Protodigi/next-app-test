# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed

- **Major Architectural Refactor:** Migrated the entire application from a client-side data fetching model to a server-centric one using `@supabase/ssr`.
- Converted pages (`/todos`, `/signin`, `/signup`) to Server Components to enable server-side data fetching and rendering.
- Replaced all client-side Supabase calls with Server Actions for mutations (add, delete, toggle) and authentication.
- Implemented React's `useOptimistic` hook on the todos page to maintain an instantaneous UI while leveraging Server Actions.
- Overhauled the entire test suite (`vitest`) to be compatible with the new server-centric architecture, mocking server actions and testing the new components.
- Removed the TanStack Query dependency in favor of the new server-side data flow.