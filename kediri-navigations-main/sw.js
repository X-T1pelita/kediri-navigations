const VERSION="v3-secure";
const STATIC_CACHE="static-"+VERSION;
const DYNAMIC_CACHE="dynamic-"+VERSION;
const ORIGIN=self.location.origin;
const ALLOWED_ORIGINS=[ORIGIN];
const FINGERPRINT_KEY="fp-token";
const RATE_LIMIT_WINDOW=4000;
const RATE_LIMIT_MAX=25;
let requestLog=[];
function rateLimited(){
    const now=Date.now();
    requestLog=requestLog.filter(t=>now-t<RATE_LIMIT_WINDOW);
    return requestLog.length>RATE_LIMIT_MAX;
}
function recordRequest(){
    requestLog.push(Date.now());
}
async function generateFingerprint(){   
    const data=crypto.getRandomValues(new Uint8Array(32));
    const hash=await crypto.subtle.digest("SHA-256",data);
    return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
async function getFingerprint(){
    const cache=await caches.open(STATIC_CACHE);
    const stored=await cache.match(FINGERPRINT_KEY);
    if(stored)return stored.text();
    const fp=await generateFingerprint();
    await cache.put(FINGERPRINT_KEY,new Response(fp));
    return fp;
}
async function validateOrigin(req){
    if(!req.referrer)return true;
    try{
        const u=new URL(req.referrer);
        return ALLOWED_ORIGINS.includes(u.origin);
    }catch(e){
        return false;
    }
}
function suspiciousUA(ua){
    if(!ua)return true;
    ua=ua.toLowerCase();
    return ua.includes("bot")||
           ua.includes("crawler")||
           ua.includes("spider")||
           ua.includes("python")||
           ua.includes("node")||
           ua.includes("scrapy")||
           ua.includes("curl")||
           ua.includes("wget")||
           ua.includes("aiohttp");
}
async function protectRequest(req){
    const ua=req.headers.get("User-Agent")||"";
    if(suspiciousUA(ua))return false;
    if(rateLimited())return false;
    if(!await validateOrigin(req))return false;
    recordRequest();
    return true;
}
async function cacheStaticAssets(cache){
    const assets=[
        "/",
        "/index.html",
        "/offline.html",
        "/css/style.css",
        "/css/responsive.css",
        "/css/animations.css",
        "/js/bootstrap.bundle.min.js",
        "/js/jquery-3.6.0.min.js",
        "/js/location-service.js",
        "/images/placeholder.jpg"
    ];
    await cache.addAll(assets);
}
self.addEventListener("install",e=>{
    e.waitUntil(
        caches.open(STATIC_CACHE)
        .then(c=>cacheStaticAssets(c))
        .then(()=>self.skipWaiting())
    );
});
self.addEventListener("activate",e=>{
    e.waitUntil(
        caches.keys().then(keys=>{
            return Promise.all(
                keys.filter(k=>!k.includes(VERSION))
                    .map(k=>caches.delete(k))
            );
        }).then(()=>self.clients.claim())
    );
});
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.method!=="GET")return;
    e.respondWith(handleRequest(req));
});
async function handleRequest(req){
    if(!await protectRequest(req)){
        return new Response("",{status:403});
    }
    const url=new URL(req.url);
    if(url.origin!==ORIGIN){
        try{
            return fetch(req);
        }catch(e){
            return new Response("",{status:502});
        }
    }
    const cached=await caches.match(req);
    if(cached){
        updateCache(req);
        return cached;
    }
    return networkFetch(req);
}
async function updateCache(req){
    try{
        const res=await fetch(req);
        if(res&&res.status===200){
            const cache=await caches.open(DYNAMIC_CACHE);
            await cache.put(req,res.clone());
        }
    }catch(e){}
}
async function networkFetch(req){
    try{
        const res=await fetch(req);
        if(res&&res.status===200){
            const cache=await caches.open(DYNAMIC_CACHE);
            await cache.put(req,res.clone());
        }
        return res;
    }catch(e){
        if(req.destination==="document"){
            return caches.match("/offline.html");
        }
        if(req.destination==="image"){
            return caches.match("/images/placeholder.jpg");
        }
        return new Response("",{status:503});
    }
}
async function cleanDynamicCache(){
    const cache=await caches.open(DYNAMIC_CACHE);
    const keys=await cache.keys();
    if(keys.length>120){
        const excess=keys.length-100;
        for(let i=0;i<excess;i++){
            await cache.delete(keys[i]);
        }
    }
}
setInterval(()=>{
    cleanDynamicCache();
},8000);
async function checkIntegrity(){
    const cache=await caches.open(STATIC_CACHE);
    const files=["/index.html","/css/style.css","/js/location-service.js"];
    for(const f of files){
        const res=await cache.match(f);
        if(!res)continue;
        const buf=await res.arrayBuffer();
        const hash=await crypto.subtle.digest("SHA-256",buf);
        const hex=[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");
        if(hex.length<40){
            await cache.delete(f);
        }
    }
}
setInterval(()=>{
    checkIntegrity();
},12000);
async function backgroundUpdate(){
    const cache=await caches.open(DYNAMIC_CACHE);
    const urls=["/","/index.html","/pages/wisata.html","/pages/kuliner.html","/pages/budaya.html"];
    for(const u of urls){
        try{
            const r=await fetch(u);
            if(r&&r.status===200){
                await cache.put(u,r.clone());
            }
        }catch(e){}
    }
}
setInterval(()=>{
    backgroundUpdate();
},20000);
self.addEventListener("sync",e=>{
    if(e.tag==="bg-sync"){
        e.waitUntil(backgroundUpdate());
    }
});
self.addEventListener("message",e=>{
    const d=e.data;
    if(d==="purge"){
        caches.keys().then(keys=>{
            keys.forEach(k=>{
                if(k!==STATIC_CACHE) caches.delete(k);
            });
        });
    }
    if(d==="update"){
        backgroundUpdate();
    }
});
async function protectHTMLContent(req){
    const url=new URL(req.url);
    if(!url.pathname.endsWith(".html"))return true;
    const fp=await getFingerprint();
    const token=req.headers.get("x-fp");
    return token===fp;
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.method==="GET" && req.destination==="document"){
        e.respondWith(htmlProtectedFlow(req));
    }
});
async function htmlProtectedFlow(req){
    if(!await protectHTMLContent(req)){
        return new Response("<h1>403 Forbidden</h1>",{status:403,headers:{"Content-Type":"text/html"}});
    }
    try{
        const cached=await caches.match(req);
        if(cached){
            updateCache(req);
            return cached;
        }
        const net=await fetch(req);
        if(net&&net.status===200){
            const cache=await caches.open(DYNAMIC_CACHE);
            await cache.put(req,net.clone());
        }
        return net;
    }catch(e){
        return caches.match("/offline.html");
    }
}
async function imageFlow(req){
    const cached=await caches.match(req);
    if(cached){
        updateCache(req);
        return cached;
    }
    try{
        const net=await fetch(req);
        if(net&&net.status===200){
            const cache=await caches.open(DYNAMIC_CACHE);
            await cache.put(req,net.clone());
        }
        return net;
    }catch(e){
        return caches.match("/images/placeholder.jpg");
    }
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.destination==="image"){
        e.respondWith(imageFlow(req));
    }
});
async function apiFlow(req){
    if(!await protectRequest(req)){
        return new Response("",{status:429});
    }
    try{
        const res=await fetch(req);
        if(res&&res.status===200){
            const cache=await caches.open(DYNAMIC_CACHE);
            await cache.put(req,res.clone());
        }
        return res;
    }catch(e){
        const cache=await caches.open(DYNAMIC_CACHE);
        const cached=await cache.match(req);
        if(cached)return cached;
        return new Response("",{status:503});
    }
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.url.includes("/api/")){
        e.respondWith(apiFlow(req));
    }
});

async function secureFetch(req){
    if(!await protectRequest(req)){
        return new Response("",{status:403});
    }
    try{
        const res=await fetch(req);
        if(res&&res.status===200){
            const cache=await caches.open(DYNAMIC_CACHE);
            await cache.put(req,res.clone());
        }
        return res;
    }catch(err){
        const cache=await caches.open(DYNAMIC_CACHE);
        const cached=await cache.match(req);
        if(cached)return cached;
        if(req.destination==="document")return caches.match("/offline.html");
        return new Response("",{status:503});
    }
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.headers.get("x-protected")==="1"){
        e.respondWith(secureFetch(req));
    }
});
async function throttle(req){
    const now=Date.now();
    if(!self.throttleMap) self.throttleMap=new Map();
    const info=self.throttleMap.get(req.url)||{time:0,count:0};
    if(now-info.time<3000){
        info.count++;
        if(info.count>15){
            return true;
        }
    } else {
        info.time=now;
        info.count=1;
    }
    self.throttleMap.set(req.url,info);
    return false;
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    throttle(req).then(t=>{
        if(t){
            e.respondWith(new Response("",{status:429}));
        }
    });
});
async function backgroundPrefetch(){
    const urls=["/","/index.html","/pages/wisata.html","/pages/kuliner.html","/pages/budaya.html"];
    const cache=await caches.open(DYNAMIC_CACHE);
    for(const u of urls){
        try{
            const r=await fetch(u,{cache:"no-store"});
            if(r&&r.status===200){
                await cache.put(u,r.clone());
            }
        }catch(e){}
    }
}
setInterval(backgroundPrefetch,25000);
async function purgeCorruptedCache(){
    const cache=await caches.open(DYNAMIC_CACHE);
    const keys=await cache.keys();
    for(const k of keys){
        const res=await cache.match(k);
        if(!res)continue;
        try{
            const buf=await res.arrayBuffer();
            if(buf.byteLength<20){
                await cache.delete(k);
            }
        }catch(e){
            await cache.delete(k);
        }
    }
}
setInterval(purgeCorruptedCache,18000);
async function secureHTML(req){
    const fp=await getFingerprint();
    const token=req.headers.get("x-fp");
    if(token!==fp){
        return new Response("",{status:403});
    }
    return htmlProtectedFlow(req);
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.destination==="document" && req.headers.get("x-fp")){
        e.respondWith(secureHTML(req));
    }
});
self.addEventListener("push",e=>{
    let data={title:"Trans Kediri",body:"Update terbaru tersedia."};
    try{
        if(e.data)data={...data,...e.data.json()};
    }catch(err){}
    const opt={
        body:data.body,
        icon:"/images/logo.jpg",
        requireInteraction:false,
        data:{url:data.url||"/"}
    };
    e.waitUntil(self.registration.showNotification(data.title,opt));
});
self.addEventListener("notificationclick",e=>{
    e.notification.close();
    const url=e.notification.data.url||"/";
    e.waitUntil(
        clients.matchAll({type:"window"}).then(list=>{
            for(const c of list){
                if(c.url===url)return c.focus();
            }
            return clients.openWindow(url);
        })
    );
});
async function blockHotlink(req){
    try{
        const ref=req.referrer||"";
        if(!ref)return true;
        const r=new URL(ref);
        return r.origin===ORIGIN;
    }catch(e){
        return true;
    }
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.destination==="image"){
        e.respondWith((async()=>{
            if(!await blockHotlink(req)){
                return new Response("",{status:403});
            }
            return imageFlow(req);
        })());
    }
});
async function strictOrigin(req){
    try{
        const o=new URL(req.url);
        return o.origin===ORIGIN;
    }catch(e){
        return false;
    }
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.headers.get("x-strict")){
        e.respondWith((async()=>{
            if(!await strictOrigin(req)){
                return new Response("",{status:403});
            }
            return secureFetch(req);
        })());
    }
});
async function secureJSON(req){
    if(!await protectRequest(req)){
        return new Response("",{status:403});
    }
    try{
        const net=await fetch(req);
        if(net&&net.status===200){
            const cache=await caches.open(DYNAMIC_CACHE);
            await cache.put(req,net.clone());
        }
        return net;
    }catch(e){
        const cache=await caches.open(DYNAMIC_CACHE);
        const c=await cache.match(req);
        if(c)return c;
        return new Response("{}",{status:503,headers:{"Content-Type":"application/json"}});
    }
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.headers.get("accept")==="application/json"){
        e.respondWith(secureJSON(req));
    }
});
async function strictHeaderCheck(req){
    const h=req.headers.get("x-auth")||"";
    if(h.length<20)return false;
    return true;
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.headers.get("x-mode")==="strict"){
        e.respondWith((async()=>{
            if(!await strictHeaderCheck(req)){
                return new Response("",{status:401});
            }
            return secureFetch(req);
        })());
    }
});
async function offlineFallback(req){
    const isHTML=req.destination==="document";
    if(isHTML){
        return caches.match("/offline.html");
    }
    if(req.destination==="image"){
        return caches.match("/images/placeholder.jpg");
    }
    return new Response("",{status:503});
}
async function deepSecureFetch(req){
    if(!await protectRequest(req)){
        return new Response("",{status:403});
    }
    if(await throttle(req)){
        return new Response("",{status:429});
    }
    try{
        const net=await fetch(req);
        if(net&&net.status===200){
            const cache=await caches.open(DYNAMIC_CACHE);
            await cache.put(req,net.clone());
        }
        return net;
    }catch(e){
        return offlineFallback(req);
    }
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.headers.get("x-level")==="deep"){
        e.respondWith(deepSecureFetch(req));
    }
});
async function enhancedCache(req){
    const c=await caches.match(req);
    if(c){
        updateCache(req);
        return c;
    }
    try{
        const net=await fetch(req);
        if(net&&net.status===200){
            const cache=await caches.open(DYNAMIC_CACHE);
            await cache.put(req,net.clone());
        }
        return net;
    }catch(e){
        return offlineFallback(req);
    }
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.headers.get("x-enhanced")){
        e.respondWith(enhancedCache(req));
    }
});
async function secureStatic(req){
    const cache=await caches.match(req);
    if(cache)return cache;
    try{
        const net=await fetch(req);
        if(net&&net.status===200){
            const c=await caches.open(STATIC_CACHE);
            await c.put(req,net.clone());
        }
        return net;
    }catch(e){
        return offlineFallback(req);
    }
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.headers.get("x-static")){
        e.respondWith(secureStatic(req));
    }
});
async function refreshCritical(){
    const urls=[
        "/index.html",
        "/css/style.css",
        "/js/location-service.js"
    ];
    const cache=await caches.open(STATIC_CACHE);
    for(const u of urls){
        try{
            const r=await fetch(u,{cache:"no-store"});
            if(r&&r.status===200){
                await cache.put(u,r.clone());
            }
        }catch(e){}
    }
}
setInterval(refreshCritical,15000);
async function secureRoute(req){
    const path=new URL(req.url).pathname;
    if(path.startsWith("/pages/")){
        const fp=await getFingerprint();
        if(req.headers.get("x-fp")!==fp){
            return new Response("",{status:403});
        }
    }
    return handleRequest(req);
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.url.includes("/pages/")){
        e.respondWith(secureRoute(req));
    }
});
async function purgeUnused(){
    const cache=await caches.open(DYNAMIC_CACHE);
    const keys=await cache.keys();
    for(const k of keys){
        if(Math.random()<0.02){
            await cache.delete(k);
        }
    }
}
setInterval(purgeUnused,10000);
async function hardSecure(req){
    if(!await protectRequest(req))return new Response("",{status:403});
    const net=await fetch(req).catch(()=>null);
    if(net&&net.status===200){
        const cache=await caches.open(DYNAMIC_CACHE);
        await cache.put(req,net.clone());
        return net;
    }
    const fallback=await caches.match(req);
    if(fallback)return fallback;
    return offlineFallback(req);
}
self.addEventListener("fetch",e=>{
    if(e.request.headers.get("x-hard")){
        e.respondWith(hardSecure(e.request));
    }
});
async function secureHTMLRoutes(req){
    const fp=await getFingerprint();
    if(req.headers.get("x-fp")!==fp){
        return new Response("<h1>403 Forbidden</h1>",{
            status:403,
            headers:{"Content-Type":"text/html"}
        });
    }
    return handleRequest(req);
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    const url=new URL(req.url);
    if(url.pathname.endsWith(".html") && req.headers.get("x-fp")){
        e.respondWith(secureHTMLRoutes(req));
    }
});
async function strictFileGuard(req){
    const ext=req.url.split(".").pop().toLowerCase();
    if(["js","css","jpg","jpeg","png","webp","svg"].includes(ext)){
        const ok=await protectRequest(req);
        if(!ok)return new Response("",{status:403});
    }
    return handleRequest(req);
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.headers.get("x-guard")){
        e.respondWith(strictFileGuard(req));
    }
});
async function timedCachePurge(){
    const cache=await caches.open(DYNAMIC_CACHE);
    const keys=await cache.keys();
    const now=Date.now();
    for(const k of keys){
        const r=await cache.match(k);
        if(!r)continue;
        const age=r.headers.get("sw-age");
        if(age && now-parseInt(age)>45000){
            await cache.delete(k);
        }
    }
}
setInterval(timedCachePurge,12000);
async function dualLayerFetch(req){
    const cache=await caches.match(req);
    if(cache){
        updateCache(req);
        return cache;
    }
    try{
        const net=await fetch(req);
        if(net&&net.status===200){
            const c=await caches.open(DYNAMIC_CACHE);
            const hdr={"sw-age":Date.now().toString()};
            const r=new Response(await net.clone().blob(),{
                status:net.status,
                statusText:net.statusText,
                headers:{...Object.fromEntries(net.headers.entries()),...hdr}
            });
            await c.put(req,r.clone());
            return r;
        }
        return net;
    }catch(e){
        return offlineFallback(req);
    }
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.headers.get("x-dual")){
        e.respondWith(dualLayerFetch(req));
    }
});
async function ghostUpdate(){
    const urls=["/","/index.html","/css/style.css"];
    const c=await caches.open(STATIC_CACHE);
    for(const u of urls){
        try{
            const r=await fetch(u,{cache:"no-store"});
            if(r&&r.status===200)await c.put(u,r.clone());
        }catch(e){}
    }
}
setInterval(ghostUpdate,30000);
async function adaptiveProtection(req){
    const ok=await protectRequest(req);
    if(!ok)return new Response("",{status:403});
    if(await throttle(req))return new Response("",{status:429});
    return deepSecureFetch(req);
}
self.addEventListener("fetch",e=>{
    if(e.request.headers.get("x-adapt")){
        e.respondWith(adaptiveProtection(e.request));
    }
});
async function hardOfflineMode(req){
    const cache=await caches.match(req);
    if(cache)return cache;
    return offlineFallback(req);
}
self.addEventListener("fetch",e=>{
    if(e.request.headers.get("x-offline")){
        e.respondWith(hardOfflineMode(e.request));
    }
});
async function mainSecure(req){
    const strict=req.headers.get("x-main")==="1";
    if(strict && !await protectRequest(req)){
        return new Response("",{status:403});
    }
    const cache=await caches.match(req);
    if(cache){
        updateCache(req);
        return cache;
    }
    return secureFetch(req);
}
self.addEventListener("fetch",e=>{
    const req=e.request;
    if(req.headers.get("x-main")){
        e.respondWith(mainSecure(req));
    }
});
async function advancedRoute(req){
    const path=new URL(req.url).pathname;
    const fp=req.headers.get("x-fp");
    const valid=await getFingerprint();
    if(fp!==valid)return new Response("",{status:403});
    if(path.startsWith("/config/")){
        return secureJSON(req);
    }
    return dualLayerFetch(req);
}
self.addEventListener("fetch",e=>{
    if(e.request.headers.get("x-route")){
        e.respondWith(advancedRoute(e.request));
    }
});
async function deepDefense(req){
    if(!await protectRequest(req))return new Response("",{status:403});
    if(await throttle(req))return new Response("",{status:429});
    const net=await fetch(req).catch(()=>null);
    if(net&&net.status===200)return net;
    const cache=await caches.match(req);
    if(cache)return cache;
    return offlineFallback(req);
}
self.addEventListener("fetch",e=>{
    if(e.request.headers.get("x-defense")==="1"){
        e.respondWith(deepDefense(e.request));
    }
});
