import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_TARGET = process.env.VITE_API_TARGET || 'http://localhost:3001'

// Dev-only middleware that runs api/send-mail.js (a Vercel serverless
// function) inline, so the contact + brochure forms work locally. In
// production Vercel hosts the same file as a real function.
function devApi() {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/send-mail')) return next()

        let raw = ''
        for await (const chunk of req) raw += chunk
        req.body = raw

        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (obj) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
          return res
        }

        try {
          const mod = await server.ssrLoadModule('/api/send-mail.js')
          await mod.default(req, res)
        } catch (err) {
          console.error('[dev-api] handler crashed', err)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Internal error' }))
          }
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [react(), tailwindcss(), devApi()],
    server: {
      proxy: {
        // Admin + products endpoints live on the Express backend
        '/api/products': { target: API_TARGET, changeOrigin: true },
        '/api/admin':    { target: API_TARGET, changeOrigin: true },
        '/api/login':    { target: API_TARGET, changeOrigin: true },
        '/api/logout':   { target: API_TARGET, changeOrigin: true },
        '/api/me':       { target: API_TARGET, changeOrigin: true },
        '/uploads':      { target: API_TARGET, changeOrigin: true },
      },
    },
  }
})
