/**
 * Single access point for environment variables (DIP: services depend on
 * this abstraction, never read `import.meta.env` directly).
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  appName: import.meta.env.VITE_APP_NAME || 'Vue SOLID Starter',
  isDev: import.meta.env.DEV,
};
