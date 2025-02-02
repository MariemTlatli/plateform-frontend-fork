const { nextui } = require('@nextui-org/theme')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(accordion|input|modal|toggle|divider).js",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B6363',
        secondary: '#002121',
        MIC: '#0B6363',
        navbar:'#0b1d1f'
      }
    }
  },
  darkMode: 'class',
  plugins: [nextui(), require('daisyui'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ]
}