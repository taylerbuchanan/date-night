// This tiny file is what lets the browser "install" the site as an app.
// It doesn't save anything offline: everything still comes fresh from the website,
// so updates show up as soon as you upload them.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
