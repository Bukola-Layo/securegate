import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          container: 'var(--color-primary-container)',
          on: 'var(--color-on-primary)',
          'on-container': 'var(--color-on-primary-container)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          container: 'var(--color-secondary-container)',
          on: 'var(--color-on-secondary)',
          'on-container': 'var(--color-on-secondary-container)',
        },
        tertiary: {
          DEFAULT: 'var(--color-tertiary)',
          container: 'var(--color-tertiary-container)',
          on: 'var(--color-on-tertiary)',
          'on-container': 'var(--color-on-tertiary-container)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          container: 'var(--color-error-container)',
          on: 'var(--color-on-error)',
          'on-container': 'var(--color-on-error-container)',
        },
        background: 'var(--color-background)',
        'on-background': 'var(--color-on-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          variant: 'var(--color-surface-variant)',
          dim: 'var(--color-surface-dim)',
          bright: 'var(--color-surface-bright)',
          'container-lowest': 'var(--color-surface-container-lowest)',
          'container-low': 'var(--color-surface-container-low)',
          container: 'var(--color-surface-container)',
          'container-high': 'var(--color-surface-container-high)',
          'container-highest': 'var(--color-surface-container-highest)',
        },
        'on-surface': {
          DEFAULT: 'var(--color-on-surface)',
          variant: 'var(--color-on-surface-variant)',
        },
        outline: {
          DEFAULT: 'var(--color-outline)',
          variant: 'var(--color-outline-variant)',
        },
        inverse: {
          surface: 'var(--color-inverse-surface)',
          'on-surface': 'var(--color-inverse-on-surface)',
          primary: 'var(--color-inverse-primary)',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
