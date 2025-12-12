/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neo-white': '#fffdf5',
                'neo-lime': '#a3e635', // lime-400
                'neo-pink': '#f472b6', // pink-400
                'neo-cyan': '#22d3ee', // cyan-400
                'neo-black': '#000000',
            },
            boxShadow: {
                'hard': '4px 4px 0px 0px #000',
                'hard-lg': '8px 8px 0px 0px #000',
            },
            fontFamily: {
                'mono': ['"Courier New"', 'Courier', 'monospace'], // Fallback simple
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
