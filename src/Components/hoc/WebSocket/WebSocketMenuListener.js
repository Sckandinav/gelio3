import { useWebSocket } from './useWebSocketSideBar';
const token = localStorage.getItem('token');

export const WebSocketMenuListener = () => {
  useWebSocket(`ws://192.168.0.233:8000/ws/doc-sidebar/?token=${token}`);
  return null;
};
