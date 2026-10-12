/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          50: '#F0EFFF',
          100: '#E1DEFF',
          200: '#C3BCFF',
          300: '#A59BFF',
          400: '#8779FF',
          500: '#6C63FF',
          600: '#4A3FFF',
          700: '#2A1FFF',
          800: '#1810E0',
          900: '#0F0AA8',
        },
        secondary: {
          DEFAULT: '#FF6584',
          50: '#FFF0F3',
          100: '#FFE1E7',
          200: '#FFC3CF',
          300: '#FFA5B7',
          400: '#FF879F',
          500: '#FF6584',
          600: '#FF3860',
          700: '#FF0B3D',
          800: '#DD0030',
          900: '#B00026',
        },
        accent: {
          DEFAULT: '#43E97B',
          50: '#EDFFF4',
          100: '#D0FFE4',
          200: '#A3FFCA',
          300: '#76FFAF',
          400: '#5AF495',
          500: '#43E97B',
          600: '#1FD45D',
          700: '#18A849',
          800: '#127C36',
          900: '#0B5023',
        },
        warning: '#FFD600',
        dark: '#1A1A2E',
        light: '#F8F9FF',
      },
      fontFamily: {
        display: ['Nunito', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(108, 99, 255, 0.12)',
        'card-hover': '0 8px 40px rgba(108, 99, 255, 0.22)',
        'glow': '0 0 20px rgba(108, 99, 255, 0.4)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out 1.5s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
