/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: 'var(--bg-canvas)',
          pure: '#000000',
        },
        surface: {
          card: 'var(--bg-surface-card)',
          elevated: 'var(--bg-surface-elevated)',
          glass: 'var(--bg-surface-glass)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        burgundy: {
          DEFAULT: '#5C1726',
          soft: '#7B2538',
          glow: 'rgba(92, 23, 38, 0.35)',
          deep: '#380E17',
        },
        scarlet: {
          DEFAULT: '#740001',
          soft: '#8F1B1C',
          glow: 'rgba(116, 0, 1, 0.3)',
        },
        gold: {
          DEFAULT: '#D3A625',
          soft: '#E6C875',
          dark: '#9E7812',
          glow: 'rgba(211, 166, 37, 0.25)',
        },
        obsidian: '#0B0B0C',
        graphite: '#1C1C1E',
        terracotta: {
          DEFAULT: '#D2583E',
          soft: '#E4745D',
        },
        sreesh: {
          DEFAULT: '#415A6C', // Titanium Slate
          light: '#65869E',
          glow: 'rgba(65, 90, 108, 0.3)',
        },
        mrithula: {
          DEFAULT: '#8A3B4E', // Warm Velvet Rose
          light: '#B2576D',
          glow: 'rgba(138, 59, 78, 0.3)',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        hand: ['Caveat', 'cursive'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.15em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
