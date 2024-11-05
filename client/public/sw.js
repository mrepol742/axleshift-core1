let cacheNameSW = 'core1_1.0.0'

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(cacheNameSW))
})

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return

    const requestUrl = new URL(event.request.url)
    const originUrl = new URL(self.location.origin)

    const isResourceRequest = requestUrl.pathname.match(
        /\.(jpg|jpeg|png|gif|svg|webp|ttf|woff|woff2)$/i,
    )

    if (requestUrl.origin !== originUrl.origin || !isResourceRequest) return

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
