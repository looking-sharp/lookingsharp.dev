document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const menuIcon = document.getElementById("menuIcon");
  
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuIcon.innerHTML = isOpen ? "&times;" : "&#9776;";
    });
});