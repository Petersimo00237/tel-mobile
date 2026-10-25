const V='byte-v2',SHELL=['/','/offline.html','/manifest.webmanifest','/icon-192.png','/logo.jpg']
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()})
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()})
self.addEventListener('fetch',e=>{const r=e.request
 if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put('/',cp))}return res}).catch(()=>caches.match('/').then(x=>x||caches.match('/offline.html'))));return}
 e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>h);return h||n}))})
