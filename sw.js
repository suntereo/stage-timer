/* Stage Timer service worker.
   Bump CACHE whenever you change index.html so phones pick up the new version. */
var CACHE = "stage-timer-v1";

var SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      // addAll fails the whole install if any one file 404s, so add them individually
      return Promise.all(SHELL.map(function(url){
        return c.add(url).catch(function(){});
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;

  var url = new URL(req.url);
  var isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";

  // Everything we care about is cache-first: the app must work with no signal at all.
  e.respondWith(
    caches.match(req).then(function(hit){
      if(hit) return hit;
      return fetch(req).then(function(res){
        if(res && (res.ok || res.type === "opaque") && (isFont || url.origin === self.location.origin)){
          var copy = res.clone();
          caches.open(CACHE).then(function(c){ c.put(req, copy).catch(function(){}); });
        }
        return res;
      }).catch(function(){
        // Offline and not cached: for a page request, fall back to the app shell.
        if(req.mode === "navigate") return caches.match("./index.html");
        return new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});
