import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#eff6ee',
          100: '#d9e8d4',
          200: '#b7d0af',
          300: '#8db283',
          400: '#67945e',
          500: '#4f7846',
          600: '#3d5f34',
          700: '#2d5016',
          800: '#274113',
          900: '#1f3410'
        },
        gold: '#8B6914',
        cream: '#F5F0E8',
        ink: '#1A1A1A',
        muted: '#6B7280'
      },
      boxShadow: {
        soft: '0 20px 60px rgba(26, 26, 26, 0.12)'
      },
      backgroundImage: {
        'grain-overlay': 'radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 45%)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.7s ease-out both'
      }
    }
  },
  plugins: []
};

export default config;