import adapter from '@sveltejs/adapter-vercel';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      runtime: 'nodejs18.x',
    }),
    csrf: {
      checkOrigin: false,
    },
  },
  vite: {
    resolve: {
      alias: {
        $lib: resolve('./src/lib'),
        $stores: resolve('./src/stores'),  // Combined both aliases under a single vite block
      },
    },
  },
};

export default config;
