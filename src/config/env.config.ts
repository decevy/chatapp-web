// src/config/env.config.ts

import { ENV_KEYS } from './constants';

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
  apiUrl: getEnvVar(ENV_KEYS.API_URL, 'http://localhost:3000'),
  hubUrl: getEnvVar(ENV_KEYS.HUB_URL, '/chatHub'),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

if (!config.apiUrl) {
  throw new Error(`${ENV_KEYS.API_URL} is not set`);
}

if (!config.hubUrl) {
  throw new Error(`${ENV_KEYS.HUB_URL} is not set`);
}

export default config;