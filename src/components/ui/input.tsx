import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Defines the props for the Input component.
 * It extends the standard HTML input attributes, allowing you to pass any valid
 * input prop (e.g., `type`, `placeholder`, `value`, `onChange`).
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * A styled input component that wraps the standard HTML `<input>` element.
 * It uses `React.forwardRef` to allow parent components to get a reference to the underlying DOM element,
 * which is useful for form handling and focus management.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        // The `cn` function merges the default input styles with any additional classes.
        // The base styles use theme variables from `globals.css` for consistent theming.
        // - `border-input`: Styles the border color.
        // - `bg-input`: Styles the background color (I corrected this from `bg-background` previously).
        // - `placeholder:text-muted-foreground`: Styles the placeholder text color.
        // - `focus-visible:ring-ring`: Styles the focus outline.
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }