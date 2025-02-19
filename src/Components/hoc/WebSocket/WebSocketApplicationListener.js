import { useSelector } from 'react-redux';

import { useApplicationWebSocket } from './useApplicationWebSocket';
import { userSelectors } from '../../../store/selectors/userSelectors';

export const WebSocketApplicationListener = () => {
  const { token } = useSelector(userSelectors).data;

  const wsPath =
    process.env.NODE_ENV === 'development'
      ? `ws://${process.env.REACT_APP_DEV_API_URL.replace(/^http:\/\//, '')}/ws/application-sidebar/?token=${token}`
      : `ws://${process.env.REACT_APP_PROD_API_URL.replace(/^http:\/\//, '')}/ws/application-sidebar/?token=${token}`;

  useApplicationWebSocket(wsPath);
  return null;
};
