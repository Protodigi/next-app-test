import * as React from "react"
import { Slot } from "@radix-ui/react-slot" // A utility from Radix UI to merge props onto a child element.
import { cva, type VariantProps } from "class-variance-authority" // A library for creating variants of a component.
import { cn } from "@/lib/utils" // A utility function to merge Tailwind classes conditionally.

/**
 * `cva` (class-variance-authority) is used to define a set of base classes and variants for a component.
 * This allows us to create different styles of buttons (e.g., primary, secondary, outline) that can be
 * controlled via props.
 */
const buttonVariants = cva(
  // Base classes applied to all button variants.
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    // Defines the different style variants of the button.
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Defines the different size variants of the button.
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    // Sets the default variants to use if none are specified.
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Defines the props for the Button component.
 * It extends the standard HTML button attributes and the variants created with `cva`.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If `true`, the button will not render its own `<button>` element.
   * Instead, it will merge its props and styles onto its immediate child element.
   * This is useful for turning other components, like a Next.js `<Link>`, into a button.
   */
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // If `asChild` is true, use the `Slot` component which will pass the props on.
    // Otherwise, render a standard `<button>` element.
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        // The `cn` function merges the default button styles, the selected variant styles,
        // and any additional classes passed in via the `className` prop.
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// Export the Button component and the variants for use in other parts of the app.
export { Button, buttonVariants }