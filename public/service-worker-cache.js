self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;
  const { method } = event.request;

  // any non GET request is ignored
  if (method.toLowerCase() !== 'get') return;

  // If the request is for the built files (which are hashed in the name)
  if (
    url.pathname.startsWith('/tossface/') ||
    url.pathname.startsWith('/build/') ||
    url.pathname.startsWith('/thumbnail/') ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      // we will open the cache
      caches.open('build-cache').then(async (cache) => {
        // if the request is cached we will use the cache
        const cacheResponse = await cache.match(event.request);
        if (cacheResponse) {
          const cachedTime = new Date(cacheResponse.headers.get('date')).getTime();
          const currentTime = new Date().getTime();

          // Check if the cache has expired
          if (currentTime - cachedTime < CACHE_EXPIRATION) {
            return cacheResponse; // If cache is valid, return it
          } else {
            // If cache has expired, delete it
            await cache.delete(event.request);
          }
        }

        // if it's not cached we will run the fetch, cache it and return it
        // this way the next time this asset it's needed it will load from the cache
        const fetchResponse = await fetch(event.request);
        cache.put(event.request, fetchResponse.clone());

        return fetchResponse;
      }),
    );
  }
});
