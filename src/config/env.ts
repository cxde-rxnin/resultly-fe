/**
 * Application configuration using Vite environment variables
 * All environment variables must be prefixed with VITE_ to be accessible in the frontend
 */

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/results',
  },
  websocket: {
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:5000',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Resultly',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Decentralized Student Result Management System',
  },
  admin: {
    key: import.meta.env.VITE_ADMIN_KEY || 'admin123',
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Type-safe environment variable validation
export const validateConfig = () => {
  const requiredEnvVars = [
    'VITE_API_URL',
  ];

  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
    console.warn('Please check your .env file. See .env.example for reference.');
  }
};

// Validate configuration on import
if (import.meta.env.DEV) {
  validateConfig();
}
