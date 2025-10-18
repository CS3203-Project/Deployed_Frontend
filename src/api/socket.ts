import { io } from 'socket.io-client';

const URL = 'https://stingray-app-t6jhs.ondigitalocean.app/messaging';

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ['polling', 'websocket'],
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
