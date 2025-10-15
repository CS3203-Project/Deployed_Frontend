import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_MESSAGING_BASE_URL || 'https://stingray-app-t6jhs.ondigitalocean.app/messaging'; // communication microservice port + namespace

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true
});
