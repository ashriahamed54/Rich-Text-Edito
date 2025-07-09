
import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				'serif': ['Georgia', 'Times New Roman', 'serif'],
				'sans': ['Arial', 'Helvetica', 'sans-serif'],
				'mono': ['Courier New', 'monospace'],
			}
		}
	},
	plugins: [],
} satisfies Config;
