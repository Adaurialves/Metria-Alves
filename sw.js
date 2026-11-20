/* METRIA — troque o número da versão a cada publicação para o app avisar "Nova versão" */
const V='metria-v6';
const ARQ=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(V).then(c=>Promise.allSettled(ARQ.map(a=>c.add(a))))); });
self.addEventListener('message',e=>{ if(e.data==='SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url); if(u.origin!==location.origin) return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{ const cp=res.clone(); caches.open(V).then(c=>c.put('index.html',cp)); return res; })
      .catch(()=>caches.match('index.html').then(x=>x||caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{ const cp=res.clone(); caches.open(V).then(c=>c.put(r,cp)); return res; })));
});
