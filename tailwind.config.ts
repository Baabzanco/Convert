import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#124A57',
          hover: '#0E3943',
          light: '#F0F7F8',
          dark: '#0A2930',
        },
        secondary: {
          DEFAULT: '#CD78B3',
          hover: '#BA65A0',
          light: '#FAF0F6',
        },
        success: {
          DEFAULT: '#16A34A',
          light: '#F0FDF4',
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#FEF2F2',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FFFBEB',
        },
        'text-primary': '#17202A',
        'text-secondary': '#667085',
        surface: '#F8FAFC',
        border: '#E5E7EB',
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 2px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
