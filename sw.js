// اسم الكاش
const CACHE_NAME = "amanat-aid-cache-v1";

// الملفات اللي نبغى نخزنها للعمل بدون نت
const URLS_TO_CACHE = [
  "./",
  "index.html",
  "style.css",
  "manifest.json",
  "sw.js",
  "bg.jpg"
  // لو عندك ملفات ثانية مهمة (صور/أيقونات) ضيفيها هنا
];

// وقت التثبيت: نخزن الملفات في الكاش
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// تفعيل: حذف الكاشات القديمة لو فيه إصدار جديد
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// عند كل طلب: نجرب من الكاش أول، لو ما لقى يروح للإنترنت
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // ممكن هنا نحط صفحة خطأ خاصة بدون نت
        })
      );
    })
  );
});