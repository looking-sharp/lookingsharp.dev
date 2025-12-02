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
    const img = event.target;
    const src = img.src;

    console.log("Zooming image:", src);

}