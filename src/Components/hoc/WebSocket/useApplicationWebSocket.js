import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setApplicationCounter } from '../../../store/slices/notifications';

export const useApplicationWebSocket = url => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      dispatch(setApplicationCounter(data));
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
