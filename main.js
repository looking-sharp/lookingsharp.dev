document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const menuIcon = document.getElementById("menuIcon");

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuIcon.innerHTML = isOpen ? "&times;" : "&#9776;";
    });
    
    const zoomItems = document.querySelectorAll(".zoomable")

    zoomItems.forEach(item => {
      item.addEventListener("click", zoom);
    });
});

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const response = await fetch(request)
  if (url.pathname.endsWith('.wasm')) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'Content-Type': 'application/wasm'
      }
    })
  }
  return response
}


function zoom(event) {
  const imgSrc = event.target.src;

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = 1000;
  overlay.style.cursor = "zoom-out";

  const zoomedImg = document.createElement("img");
  zoomedImg.src = imgSrc;
  zoomedImg.style.width = "100%"; 
  zoomedImg.style.height = "auto"; 
  zoomedImg.style.maxHeight = "100%";
  zoomedImg.style.objectFit = "contain";

  overlay.appendChild(zoomedImg);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });
}