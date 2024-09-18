// src/ServiceWorkerRegistration.jsx

import React, { useEffect } from 'react';

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swUrl = 'https://lfw-app.vercel.app/service-worker.js';
        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            console.log('ServiceWorker registered: ', registration);
          })
          .catch((error) => {
            console.error('Error registering service worker: ', error);
          });
      });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default ServiceWorkerRegistration;