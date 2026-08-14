// Production and local environment API URL configurations
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
export const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, '')}/api/v1`;
export const RASA_URL = import.meta.env.VITE_RASA_URL || 'http://localhost:5005';
