/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0F0F10',    // Solid matte dark
          card: '#18181A',       // Tactile dark surface
          elevated: '#232326',   // Raised tactile block
          border: 'transparent', // ALL THIN BORDERS REMOVED EVERYWHERE
          highlight: 'transparent',
        },
        text: {
          primary: '#F4F4F5',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
        accent: {
          DEFAULT: '#E4E4E7',    // Clean monochrome high contrast
          hover: '#FFFFFF',
          light: '#F4F4F5',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#71717A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        // Physical 3D pop-out button and tab effects (clean pure shadow, no borders)
        'pop': '0 4px 0 0 #0A0A0C, 0 6px 12px rgba(0, 0, 0, 0.45)',
        'pop-hover': '0 6px 0 0 #0A0A0C, 0 10px 20px rgba(0, 0, 0, 0.55)',
        'pop-active': '0 1px 0 0 #0A0A0C, 0 2px 4px rgba(0, 0, 0, 0.3)',
        'pop-pill': '0 3px 0 0 #0A0A0C, 0 4px 8px rgba(0, 0, 0, 0.4)',
        'pop-pill-active': '0 1px 0 0 #0A0A0C, inset 0 1px 2px rgba(0,0,0,0.5)',
      }
    },
  },
  plugins: [],
}
