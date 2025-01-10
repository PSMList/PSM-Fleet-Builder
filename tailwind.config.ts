import resolveConfig from 'tailwindcss/resolveConfig';

const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--psmlist-primary)',
          dark: 'var(--psmlist-primary-darken)',
        },
      },
    },
  },
  blocklist: ['collapse'],
  plugins: [],
};

export default resolveConfig(config);
