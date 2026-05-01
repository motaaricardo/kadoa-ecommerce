import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        baby: {
          50: '#F5EBE8',
          100: '#E8D5CC',
          200: '#DBC0B4',
          300: '#CEAB9C',
          400: '#C19684',
          500: '#B4816C',
          600: '#8B6454',
        },
        accent: {
          50: '#FFF0F6',
          100: '#FFD9E8',
          200: '#FFC0E3',
          300: '#FFB6D9',
          400: '#F894C3',
          500: '#E674AC',
          600: '#C85A8E',
        },
        ink: {
          DEFAULT: '#3A3A3A',
          soft: '#6B6B6B',
          mute: '#A0A0A0',
        },
        cream: '#FFFBF7',
        sage: '#D4E5DC',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        cormorant: ['var(--font-cormorant)', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(232, 116, 172, 0.18)',
        glow: '0 0 0 4px rgba(255, 182, 217, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
