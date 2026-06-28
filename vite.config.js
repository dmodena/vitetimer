import { defineConfig } from 'vite';

export default defineConfig({
  preview: {
    // This allows any dynamic URL from localtunnel to connect
    allowedHosts: ['.loca.lt']
  }
});
