/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {      
			fontFamily: {
			sans: ["Inter", "OpenSans"],
		  },
		  colors: {
			primaryColor: 'var(--primary-color)',
			secondaryColor: 'var(--secondary-color)',
			primaryTextColor: 'var(--primary-text-color)',
			secondaryTextColor: 'var(--secondary-text-color)',
			tertiaryTextColor: 'var(--tertiary-text-color)',
			primaryBg: 'var(--primary-bg-color)',
			secondaryBg: 'var(--secondary-bg-color)',
			primaryGradient: 'var(--primary-gradient)',
			secondaryGradient: 'var(--secondary-gradient)',
			tertiaryGradient: 'var(--tertiary-gradient)',
		  },
		},
	},
	plugins: [ require('tailwindcss-animated')],
}
