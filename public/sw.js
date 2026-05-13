self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installed');
});

self.addEventListener('fetch', (e) => {
    // This empty fetch event tells the browser this app can handle network requests, 
    // passing the criteria to trigger the "Install App" prompt.
});