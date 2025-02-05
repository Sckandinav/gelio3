import { useWebSocket } from './useWebSocketSideBar';
const token = localStorage.getItem('token');

const wsMenuPath =
  process.env.NODE_ENV === 'development'
    ? `ws://${process.env.REACT_APP_DEV_API_URL.replace(/^http:\/\//, '')}/ws/doc-sidebar/?token=${token}`
    : `ws://${process.env.REACT_APP_PROD_API_URL.replace(/^http:\/\//, '')}/ws/doc-sidebar/?token=${token}`;

export const WebSocketMenuListener = () => {
  useWebSocket(wsMenuPath);
  return null;
};
