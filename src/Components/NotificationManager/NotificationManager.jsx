import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { notificationsSelector } from '../../store/selectors/notificationsSelector';

export const NotificationManager = () => {
  const { notifications } = useSelector(notificationsSelector);
  const unreadCount = notifications[0]?.notifications.length || 0;
  const blinkIntervalRef = useRef(null);
  const originalTitleRef = useRef(document.title);
  const originalFaviconRef = useRef(document.querySelector("link[rel~='icon']")?.href);
  let faviconElement = document.querySelector("link[rel~='icon']");

  if (!faviconElement) {
    faviconElement = document.createElement('link');
    faviconElement.rel = 'icon';
    document.head.appendChild(faviconElement);
  }

  const updateFavicon = isNew => {
    faviconElement.href = isNew ? '/notification.ico' : originalFaviconRef.current;
  };

  const startBlinking = () => {
    let isChanged = false;

    blinkIntervalRef.current = setInterval(() => {
      // if (document.hidden) return;
      document.title = isChanged ? `(${unreadCount}) Уведомление!` : originalTitleRef.current;
      updateFavicon(isChanged);

      isChanged = !isChanged;
    }, 1000);
  };

  const stopBlinking = () => {
    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }
    document.title = originalTitleRef.current;
    updateFavicon(false);
  };

  const showNotification = () => {
    if (document.hidden && Notification.permission === 'granted') {
      new Notification('Новое уведомление', {
        body: `У вас ${unreadCount} новых уведомлений`,
        icon: '/notification.ico',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted' && document.hidden) {
          new Notification('Новое уведомление', {
            body: `У вас ${unreadCount} новых уведомлений`,
            icon: '/notification.ico',
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
