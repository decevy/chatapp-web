// src/config/env.config.ts

interface EnvConfig {
  apiUrl: string;
  hubUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const getEnvVar = (key: string, fallback: string): string => {
  return import.meta.env[key] || fallback;
};

const config: EnvConfig = {
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3000'),
  hubUrl: getEnvVar('VITE_HUB_URL', '/chatHub'),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

if (!config.apiUrl) {
  throw new Error('VITE_API_URL is not set');
}

if (!config.hubUrl) {
  throw new Error('VITE_HUB_URL is not set');
}

export default config;