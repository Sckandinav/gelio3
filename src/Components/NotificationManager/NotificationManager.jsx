import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { notificationsSelector } from '../../store/selectors/notificationsSelector';

export const NotificationManager = () => {
  const { unreadCount } = useSelector(notificationsSelector);
  const blinkIntervalRef = useRef(null);
  const originalTitleRef = useRef(document.title);

  const startBlinking = () => {
    let isChanged = false;

    blinkIntervalRef.current = setInterval(() => {
      if (document.hidden) return;

      document.title = isChanged ? originalTitleRef.current : `(${unreadCount}) Новое уведомление!`;

      isChanged = !isChanged;
    }, 1000);
  };

  const stopBlinking = () => {
    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }
    document.title = originalTitleRef.current;
  };

  const showNotification = () => {
    if (document.hidden && Notification.permission === 'granted') {
      new Notification('Новое уведомление', {
        body: `У вас ${unreadCount} новых уведомлений`,
        icon: 'path/to/your/notification-icon.png',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted' && document.hidden) {
          new Notification('Новое уведомление', {
            body: `У вас ${unreadCount} новых уведомлений`,
            icon: 'path/to/your/notification-icon.png',
          });
        }
      });
    }
  };

  useEffect(() => {
    if (unreadCount > 0) {
      startBlinking();
      showNotification();
    } else {
      stopBlinking();
    }

    return stopBlinking;
  }, [unreadCount]);

  return null;
};
