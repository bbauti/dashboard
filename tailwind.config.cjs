/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	daisyui: {
		themes: [
			{
				dark: {
						"primary": "#641ae6",
						"secondary": "#181818",
						"secondary-content": "#212020",
						"accent": "#f8f8f8",
						"neutral": "#111111",
						"base-100": "#0e0e0e",
						"base-300": "#000000",
						"info": "#3abff8",
						"success": "#16a34a",
						"warning": "#fbbd23",
						"error": "#f87272",
				},
				light: {
					"primary": "#641ae6",
					"secondary": "#e7e5e4",
					"secondary-content": "#fbfbfb",
					"accent": "#070707",
					"neutral": "#d6d3d1",
					"base-100": "#f5f5f4",
					"base-300": "#f5f5f4",
					"info": "#3abff8",
					"success": "#16a34a",
					"warning": "#fbbd23",
					"error": "#f87272",
				},
			},
		],
	},

	plugins: [require("@tailwindcss/typography"), require("daisyui")],
};

module.exports = config;
