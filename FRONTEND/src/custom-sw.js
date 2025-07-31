import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);


// Install: skip waiting to activate immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installed');
  self.skipWaiting();
});

// Activate: claim clients immediately and reload all open tabs
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(
    (async () => {
      // Claim control
      await self.clients.claim();

      // Optional: reload all open windows
      const clientsList = await self.clients.matchAll({ type: 'window' });
      for (const client of clientsList) {
        client.navigate(client.url);
      }
    })()
  );
});

// Listen for "SKIP_WAITING" messages from client to manually skip waiting (if you use registerSW())
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push Notification support (optional)
self.addEventListener('push', (event) => {
  const body = event.data?.text() || 'You have a new notification!';
  event.waitUntil(
    self.registration.showNotification('HomeX', {
      body,
      icon: '/pwa-192x192.png', // update this with your icon path
    })
  );
});
