// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  // CRITICAL: Content must point to all files that use Tailwind classes
  content: [
    "./index.html",
    // This is the common pattern for React components in the src/ directory
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  // Moves the dark mode setting from the deleted script
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        // Moves your custom primary color definition
        primary: { 
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        }
      }
    }
  },
  plugins: [],
} satisfies Config;
