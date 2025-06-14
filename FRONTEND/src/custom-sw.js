import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", () => {
    console.log('babyyyyy');
  }
);

self.addEventListener('push',  (e) => {
    self.registration.showNotification('Wooohoooo babbyyyy', {
        body: e.data.text()
    })
})