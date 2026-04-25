import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BillEasy Ultra-Premium Design System
        primary: {
          50: '#f0f4ff',
          100: '#e1e9ff',
          200: '#c8d5ff',
          300: '#a3b7ff',
          400: '#758dff',
          500: '#4f66ff', // Signature Royal Blue
          600: '#3b4ae6',
          700: '#2d37c7',
          800: '#272e9e',
          900: '#242a7e',
          950: '#141749',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Vibrant Emerald
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Amber Sun
          600: '#d97706',
        },
        destructive: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Modern Rose
          600: '#dc2626',
        },
        background: '#fcfdfe',
        surface: {
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
        },
        border: '#eef2f6',
        ring: 'rgba(79, 102, 255, 0.2)',
      },
      borderRadius: {
        'button': '0.625rem',
        'card': '1rem',
        'input': '0.75rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'medium': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.12)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%)',
        'brand-gradient': 'linear-gradient(135deg, #4f66ff 0%, #2d37c7 100%)',
        'surface-gradient': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}

export default config
