/**
 * This is a TypeScript declaration file (`.d.ts`). Its purpose is to provide type information
 * to the TypeScript compiler about modules or objects that are not written in TypeScript.
 * In this case, it's augmenting the global `NodeJS.ProcessEnv` type.
 */

declare namespace NodeJS {
  /**
   * By augmenting the `ProcessEnv` interface, we are telling TypeScript about the environment
   * variables that our application expects to be present.
   * This provides two key benefits:
   * 1. Type Safety: When you access `process.env.NEXT_PUBLIC_SUPABASE_URL`, TypeScript knows
   *    it is a `string` and not `string | undefined`.
   * 2. Autocompletion: Your code editor will be able to autocomplete these variable names.
   */
  interface ProcessEnv {
    // The public URL for your Supabase project.
    NEXT_PUBLIC_SUPABASE_URL: string
    // The public "anonymous" key for your Supabase project. This key is safe to expose in the browser.
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  }
}