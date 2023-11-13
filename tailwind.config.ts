import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import colors from './configs/tailwind/colors'
import generateProseColors from './configs/tailwind/generate-prose-colors'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  plugins: [forms, typography],
  safelist: [{
      pattern: /(bg|text|border)-(brand|dracula|smoke|slate|grey|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|transparent|current|black|white)/,
  }],
	theme: {
		extend: {
      colors,
      typography: ({ theme }) => ({
        'smoke': { css: generateProseColors(theme, 'smoke') },
      }),
    },
	},
}
