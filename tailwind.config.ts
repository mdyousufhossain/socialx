import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    container: {
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      keyframes: {
        // Existing keyframes
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        progressBar: {
          '0%': {
            backgroundPosition: '200% 0'
          },
          '100%': {
            backgroundPosition: '-200% 0'
          }
        },
        // NEW ANIMATION KEYFRAMES FOR HERO SECTION
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-10px) translateX(10px)' },
          '50%': { transform: 'translateY(0px) translateX(0px)' },
          '75%': { transform: 'translateY(10px) translateX(-10px)' }
        },
        pulse: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.25' }
        }
      },
      animation: {
        // Existing animations
        progressBar: 'progressBar 1s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // NEW ANIMATIONS FOR HERO SECTION
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delay-slow': 'float 8s ease-in-out infinite -2s', // 2s delay
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      backgroundImage: {
        hero: '',
        wedo: ''
      },
      colors: {
        primary: {
          100: '#093FB4', // This is your 'blue-600' equivalent for primary actions
          200: '#161D6F', // This is your 'blue-800' equivalent for primary gradients
          300: '#006BFF' // This could be your hover state or secondary blue
        },
        light: {
          100: '#E6E6FA', // moon raker
          200: '#eaeefa',
          300: '#e6ebf8',
          400: '#e1e1ee'
        },
        dark: {
          100: '#000719',
          200: '#010b0f',
          300: '#0b080f',
          400: '#0a1213'
        },
        yellow: {
          100: '#ffd600', // gold
          200: '#ffbd00', // amber
          300: '#FFC41A', // light amber
          400: '#c19105' // dark amber
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        },
        blue: {
          50: '#F0F8FF',
          100: '#E0F2FE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A'
        }
      }
    },
    fontFamily: {
      roboto: ['var(--font-roboto)'],
      lobster: ['var(--font-lobster)'], // Corrected typo: 'lobser' -> 'lobster'
      glock: ['var(--font-glock)']
    },
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  },
  plugins: []
}
export default config
