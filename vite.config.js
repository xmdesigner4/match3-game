import { defineConfig, loadEnv } from 'vite';
import dns from 'dns';

dns.setDefaultResultOrder('verbatim')

export default ({mode}) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
    const isProd = process.env.NODE_ENV === 'production';
    const isDev = process.env.NODE_ENV === 'development';

    return defineConfig({
        base: './',
        server: {
            port: 9004,
            host: '0.0.0.0'
        },

        optimizeDeps: {
            disabled: false,
        },
        build: {
            commonjsOptions: {
                include: []
            }
        }
    })
}
