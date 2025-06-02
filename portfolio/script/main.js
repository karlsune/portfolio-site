// =========================
// MOBILE MENU TOGGLE
// =========================
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("main-nav");
menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
  // Update aria-expanded for accessibility
  menuToggle.setAttribute(
    "aria-expanded",
    nav.classList.contains("open") ? "true" : "false",
  );
});

// Close menu on nav link click (mobile)
document.querySelectorAll("header nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

// Start the subtitle animation on page load
typeSubtitle(subtitles[subtitleIndex], () => {
  setTimeout(nextSubtitle, 1200);
});

// back to top button function
const backToTop = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
