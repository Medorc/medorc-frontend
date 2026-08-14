// Production and local environment API URL configurations
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://medorc-backend.onrender.com';
export const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, '')}/api/v1`;
export const RASA_URL = import.meta.env.VITE_RASA_URL || 'https://medorc-orby-chatbot.onrender.com';
