import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to conditionally join class names together.
 * This is a common pattern in component-based libraries like React.
 * It's particularly useful for creating components with variants, where some classes
 * might be conditional based on props.
 * 
 * It combines two key utilities:
 * 1. `clsx`: Allows you to pass classes as strings, objects, or arrays, and it will
 *    intelligently join them. For example: `clsx('foo', true && 'bar', { baz: false, qux: true })`
 *    would return `'foo bar qux'`.
 * 2. `tailwind-merge`: Solves conflicts in Tailwind CSS classes. For example, if you have
 *    `p-2` and `p-4` in the same class list, `tailwind-merge` knows that `p-4` should take
 *    precedence and will remove `p-2`. This is essential for overriding default styles.
 * 
 * @param {...ClassValue[]} inputs - A list of class values to be merged.
 * @returns {string} The final, merged class name string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}