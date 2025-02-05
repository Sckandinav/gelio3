import { useWebSocket } from './useWebSocket';
const token = localStorage.getItem('token');

const wsPath =
  process.env.NODE_ENV === 'development'
    ? `ws://${process.env.REACT_APP_DEV_API_URL.replace(/^http:\/\//, '')}/ws/notifications/?token=${token}`
    : `ws://${process.env.REACT_APP_PROD_API_URL.replace(/^http:\/\//, '')}/ws/notifications/?token=${token}`;

export const WebSocketListener = () => {
  useWebSocket(wsPath);
  return null;
};
