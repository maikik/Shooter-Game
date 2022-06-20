'use strict';


const CACHE_NAME = 'static-cache-v9';



const FILES_TO_CACHE = [
    '/offline.html',
    '/index.html',
    'files/install.js',
    'assets/img/bueno_muerto.png',
    'assets/img/bueno.png',
    'assets/img/jefe_muerto.png',
    'assets/img/jefe.png',
    'assets/img/malo_muerto.png',
    'assets/img/malo.png',
    'assets/img/shot1.png',
    'assets/img/shot2.png',
    'assets/img/you_win.png'
    

];

self.addEventListener('install', (evt) => { 
    console.log('[ServiceWorker] Install');

    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});


self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);

    evt.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
        return cache.match(evt.request)
        .then((response) => {
            console.log("RESP", response);
            return response || fetch(evt.request);
        });
    })
    );
}); 


self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');

    evt.waitUntil(
        caches.keys().then((KeyList) => {
            return Promise.all(KeyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        }) 
    );
    self.clients.claim();
});
