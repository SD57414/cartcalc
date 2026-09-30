var CACHE='graincart-v1';
var XLSX_URL='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
var FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',function(e){
e.waitUntil(caches.open(CACHE).then(function(c){
return Promise.all(FILES.map(function(f){return c.add(f).catch(function(){})}).concat([c.add(XLSX_URL).catch(function(){})]))
}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){
e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
if(e.request.method!=='GET')return;
e.respondWith(caches.open(CACHE).then(function(c){
return c.match(e.request,{ignoreSearch:true}).then(function(hit){
var net=fetch(e.request).then(function(r){if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r}).catch(function(){return hit});
return hit||net})}))});
