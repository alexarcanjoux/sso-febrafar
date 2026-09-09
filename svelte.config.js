import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    // `$lib` (nativo do SvelteKit) já aponta para src/lib — os componentes
    // são importados por `$lib/index.js`, a superfície pública do DS.
    alias: {
      $components: 'src/lib/components',
    },
  },
};
