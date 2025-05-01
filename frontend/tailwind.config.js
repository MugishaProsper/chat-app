/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#00ff9d",
				secondary: "#00b8ff",
				background: "#0a0a0a",
				surface: "#1a1a1a",
				text: "#ffffff",
				"text-secondary": "#a0a0a0",
			},
		},
	},
	// eslint-disable-next-line no-undef
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				futuristic: {
					"primary": "#00ff9d",
					"secondary": "#00b8ff",
					"accent": "#ff00ff",
					"neutral": "#1a1a1a",
					"base-100": "#0a0a0a",
					"info": "#00b8ff",
					"success": "#00ff9d",
					"warning": "#ffcc00",
					"error": "#ff3333",
				},
			},
		],
		darkTheme: "futuristic",
	},
};
