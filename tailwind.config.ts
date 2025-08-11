import type { Config } from "tailwindcss"

const config: Config = {
  // Specifies that dark mode is triggered by a class on a parent element (e.g., `<body class="dark">`).
  darkMode: ["class"],
  
  // Configures the files that Tailwind will scan to find utility classes.
  // This is crucial for tree-shaking, ensuring only the CSS that is actually used
  // gets included in the final build.
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}"
  ],
  
  // The `theme` object is where you define and extend Tailwind's default design system.
  theme: {
    // The `container` key is used to configure the default container component from Tailwind.
    container: {
      center: true, // Horizontally centers the container.
      padding: "2rem", // Default padding.
      screens: { "2xl": "1400px" } // Sets the max-width for the container on large screens.
    },
    // The `extend` object allows you to add new values to Tailwind's theme or override existing ones.
    extend: {
      // This is the core of the ShadCN theming strategy.
      // We are teaching Tailwind about our custom color names (like `primary`, `card`, etc.).
      // Each color is defined by a CSS variable that we declared in `globals.css`.
      // For example, when you use the class `bg-primary`, Tailwind will now apply the color
      // defined in the `--primary` CSS variable.
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)", // Used for classes like `bg-primary`
          foreground: "var(--primary-foreground)" // Used for `text-primary-foreground`
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)"
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)"
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)"
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)"
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)"
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)"
        }
      },
      // We are also making our CSS variable for border-radius available to Tailwind.
      // Now you can use classes like `rounded-lg` and it will use the value of `--radius`.
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      // Defines custom keyframe animations for components like accordions.
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      // Makes the keyframe animations available as utility classes.
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  // `tailwindcss-animate` is a plugin required by ShadCN for its animations.
  plugins: [require("tailwindcss-animate")]
}

export default config