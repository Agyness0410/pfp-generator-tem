/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rose-gold': '#E8B4B8',
        'champagne': '#F7E7CE',
        'blush': '#FFE5E5',
        'lavender': '#E6E6FA',
        'pearl': '#F8F6F0',
        'mauve': '#E0B4D6',
        'dusty-rose': '#D4A5A5',
      },
      backgroundImage: {
        'gradient-purple-pink': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-rose-gold': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'gradient-champagne': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'gradient-luxury': 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
        'gradient-feminine': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        'gradient-premium': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'shimmer': 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
      },
      fontFamily: {
        'luxury': ['Playfair Display', 'serif'],
        'elegant': ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'elegant': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}