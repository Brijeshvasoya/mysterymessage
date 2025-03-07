import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'shine': 'shine 1.5s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'shine': {
          '0%': { 'transform': 'translateX(-100%)' },
          '100%': { 'transform': 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [forms],
}

export default config
