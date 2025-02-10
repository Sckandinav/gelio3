import { useSelector } from 'react-redux';

import { useWebSocket } from './useWebSocket';
import { userSelectors } from '../../../store/selectors/userSelectors';

export const WebSocketListener = () => {
  const { token } = useSelector(userSelectors).data;

  const wsPath =
    process.env.NODE_ENV === 'development'
      ? `ws://${process.env.REACT_APP_DEV_API_URL.replace(/^http:\/\//, '')}/ws/notifications/?token=${token}`
      : `ws://${process.env.REACT_APP_PROD_API_URL.replace(/^http:\/\//, '')}/ws/notifications/?token=${token}`;

  useWebSocket(wsPath);
  return null;
};
