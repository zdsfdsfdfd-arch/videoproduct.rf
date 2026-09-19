import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/**
 * Serves functions/api/lead.ts under /api/lead during `vite dev`, so the Telegram
 * form works locally with the same code that runs on the host's serverless runtime.
 * In production the host (Cloudflare Pages / Netlify) routes /api/lead to the function itself.
 */
function devLeadApi(env: Record<string, string>): Plugin {
  return {
    name: 'dev-lead-api',
    configureServer(server) {
      server.middlewares.use('/api/lead', async (req, res) => {
        const mod = await server.ssrLoadModule('/functions/api/lead.ts');
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const request = new Request(`http://localhost${req.url ?? ''}`, {
          method: req.method,
          headers: req.headers as Record<string, string>,
          body: chunks.length && req.method !== 'GET' && req.method !== 'HEAD' ? Buffer.concat(chunks) : undefined,
        });
        const response: Response = await mod.handleLead(request, {
          TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN,
          TELEGRAM_CHAT_ID: env.TELEGRAM_CHAT_ID,
        });
        res.statusCode = response.status;
        response.headers.forEach((v, k) => res.setHeader(k, v));
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // PREVIEW=1 builds a relocatable bundle (relative asset URLs) for hosting under a sub-path
    base: process.env.PREVIEW ? './' : '/',
    plugins: [react(), devLeadApi(env)],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: {
      outDir: process.env.PREVIEW ? 'dist-preview' : 'dist',
      target: 'es2022',
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          manualChunks: { react: ['react', 'react-dom'] },
        },
      },
    },
  };
});
