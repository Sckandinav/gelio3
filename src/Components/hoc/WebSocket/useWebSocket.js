import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/slices/notifications';

export const useWebSocket = url => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      dispatch(addNotification({ ...data, read: false }));
    };

    socket.onerror = error => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, [url, dispatch]);
};
