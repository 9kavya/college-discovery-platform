import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7fe',
          100: '#e8effd',
          200: '#d5e2fb',
          300: '#b6ccf8',
          400: '#90aff3',
          500: '#3b82f6', // Standard vibrant blue
          550: '#638aeb',
          600: '#2563eb', // Nice blue brand accent
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316', // Vibrant orange accent similar to Collegedunia/Careers360
          600: '#ea580c',
          700: '#c2410c',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          800: '#111827',
          900: '#030712',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.08)',
        premium: '0 4px 20px -2px rgba(17, 24, 39, 0.05), 0 2px 6px -1px rgba(17, 24, 39, 0.03)',
      }
    },
  },
  plugins: [],
};
export default config;
