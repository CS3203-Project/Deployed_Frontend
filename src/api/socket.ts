import { io } from 'socket.io-client';

const URL = import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL_MESSAGES_PROD : import.meta.env.VITE_API_BASE_URL_MESSAGES; // communication microservice port + namespace

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true
});
