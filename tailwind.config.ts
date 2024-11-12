import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      textColor: {
              DEFAULT: '#ffffff', // Set the default text color to white
            },
    }
  },

  plugins: []
} satisfies Config;
