import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

function custom404Plugin() {
  const known = new Set([
    '/', '/index', '/index.html',
    '/about', '/about.html',
    '/projects', '/projects.html',
    '/contact', '/contact.html',
    '/internship', '/internship.html',
    '/404', '/404.html',
  ]);
  return {
    name: 'custom-404',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '/').split('?')[0].split('#')[0];
        if (
          url.startsWith('/@') ||
          url.startsWith('/node_modules/') ||
          url.startsWith('/assets/') ||
          url.startsWith('/components/') ||
          /\.[a-z0-9]+$/i.test(url) ||
          known.has(url)
        ) return next();
        req.url = '/404.html';
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    custom404Plugin(),
    viteStaticCopy({
      targets: [
        { src: 'assets/images', dest: 'assets' },
        { src: 'assets/files', dest: 'assets' },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        projects: resolve(__dirname, 'projects.html'),
        contact: resolve(__dirname, 'contact.html'),
        internship: resolve(__dirname, 'internship.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
});
