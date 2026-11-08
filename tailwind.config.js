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
          DEFAULT: '#672B3C',
          soft: '#8B465A',
          glow: 'rgba(103, 43, 60, 0.35)',
          deep: '#421622',
        },
        sreesh: {
          DEFAULT: '#3E5463', // Slate Obsidian
          light: '#5B788C',
          glow: 'rgba(62, 84, 99, 0.3)',
        },
        mrithula: {
          DEFAULT: '#7A3B4D', // Warm Rose Burgundy
          light: '#9E5066',
          glow: 'rgba(122, 59, 77, 0.3)',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
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
