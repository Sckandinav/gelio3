import { useSelector } from 'react-redux';

import { useWebSocket } from './useWebSocketSideBar';
import { userSelectors } from '../../../store/selectors/userSelectors';

export const WebSocketMenuListener = () => {
  const { token } = useSelector(userSelectors).data;
  const wsMenuPath =
    process.env.NODE_ENV === 'development'
      ? `ws://${process.env.REACT_APP_DEV_API_URL.replace(/^http:\/\//, '')}/ws/doc-sidebar/?token=${token}`
      : `ws://${process.env.REACT_APP_PROD_API_URL.replace(/^http:\/\//, '')}/ws/doc-sidebar/?token=${token}`;
  useWebSocket(wsMenuPath);
  return null;
};
