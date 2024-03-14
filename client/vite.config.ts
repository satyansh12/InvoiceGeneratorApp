import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all environment variables from the .env file in the current working directory
  // regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Use the `define` option to inject specific environment variables or global constants
    // into your client-side code.
    define: {
      // Ensure to stringify the values as they will be injected into the code as-is.
      'process.env.REACT_APP_SERVER_URL': JSON.stringify(env.REACT_APP_SERVER_URL),
      'process.env.REACT_APP_CLIENT_URL': JSON.stringify(env.REACT_APP_CLIENT_URL),
    },
  };
});
