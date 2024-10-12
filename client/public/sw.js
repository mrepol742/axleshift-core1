let cacheNameSW = 'core1'

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(cacheNameSW))
})

self.addEventListener('fetch', async (event) => {
    if (event.request.method !== 'GET') return

    const requestUrl = new URL(event.request.url)
    const originUrl = new URL(self.location.origin)

    if (requestUrl.origin !== originUrl.origin) return
    event.respondWith(
        caches.open(cacheNameSW).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                return (
                    cachedResponse ||
                    fetch(event.request).then((fetchedResponse) => {
                        if (fetchedResponse && fetchedResponse.status === 200) {
                            cache.put(event.request, fetchedResponse.clone())
                        }
                        return fetchedResponse
                    })
                )
            })
        }),
    )
})
