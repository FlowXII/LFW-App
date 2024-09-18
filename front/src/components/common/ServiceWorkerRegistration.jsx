import React, { useEffect, useState } from 'react';

const ServiceWorkerRegistration = () => {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const swUrl = `lfw-app.vercel.app/service-worker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('ServiceWorker registered: ', registration);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content is available; please refresh.');
                  setWaitingWorker(registration.waiting);
                  setNewVersionAvailable(true);
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('Error registering service worker: ', error);
        });
    }
  }, []);

  const updateServiceWorker = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setNewVersionAvailable(false);
      window.location.reload();
    }
  };

  if (newVersionAvailable) {
    return (
      <div>
        New version available! 
        <button onClick={updateServiceWorker}>Update and Reload</button>
      </div>
    );
  }

  return null;
};

export default ServiceWorkerRegistration;
