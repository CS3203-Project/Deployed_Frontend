import { io } from 'socket.io-client';

const URL = import.meta.env.MODE === 'production' ? 'YOUR_PRODUCTION_URL/messaging' : 'http://13.49.159.218/messaging'; // communication microservice port + namespace

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true
});
