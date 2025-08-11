'use client'
// This component is a Client Component because it relies on user interaction and state.

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox" // The underlying headless checkbox component from Radix UI.
import { Check } from "lucide-react" // The checkmark icon.

import { cn } from "@/lib/utils"

/**
 * Defines the props for the Checkbox component.
 * It extends the props of the underlying Radix Checkbox, allowing for full customization.
 */
export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}

/**
 * A custom-styled checkbox component built on top of Radix UI's headless checkbox.
 * This approach separates the complex logic (handled by Radix) from the styling (handled here).
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  // `CheckboxPrimitive.Root` is the main component from Radix that provides all the functionality.
  <CheckboxPrimitive.Root
    ref={ref}
    // The `cn` function merges the default checkbox styles with any additional classes.
    // Note the use of `data-[state=checked]:...` selectors, which is a Radix feature
    // for styling the component based on its internal state.
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    {/* `CheckboxPrimitive.Indicator` is a Radix component that only renders when the checkbox is checked. */}
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }