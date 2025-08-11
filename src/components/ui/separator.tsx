import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * A simple visual separator component.
 * It renders a thin horizontal line, styled using the theme's border color.
 */
const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // The `cn` function merges the default separator styles with any additional classes.
    // - `bg-border`: Uses the theme's border color for the line.
    // - `h-px`: Sets the height to 1 pixel.
    // - `w-full`: Makes the line span the full width of its container.
    className={cn("shrink-0 bg-border h-px w-full", className)}
    // The `role="separator"` is important for accessibility, as it tells screen readers
    // that this element is a semantic separator.
    role="separator"
    {...props}
  />
))
Separator.displayName = "Separator"

export { Separator }