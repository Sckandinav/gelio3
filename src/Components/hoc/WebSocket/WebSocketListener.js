import { useWebSocket } from './useWebSocket';
const token = localStorage.getItem('token');

export const WebSocketListener = () => {
  useWebSocket(`ws://192.168.0.233:8000/ws/notifications/?token=${token}`);
  return null;
};
