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


// ANIMATED SUBTITLE (TYPEWRITER EFFECT) AIGC

let subtitleIndex = 0;
const subtitleEl = document.getElementById("site-subtitle");

// Helper to set subtitle text with blinking cursor
function setSubtitleWithCursor(text) {
  subtitleEl.innerHTML = `<span class="subtitle-text">${text}</span><span class="subtitle-cursor">▌</span>`;
}

// Typewriter effect with persistent blinking cursor
function typeSubtitle(text, cb) {
  let i = 0;
  function type() {
    setSubtitleWithCursor(text.slice(0, i));
    if (i < text.length) {
      i++;
      setTimeout(type, 55);
    } else if (cb) {
      setTimeout(cb, 900);
    }
  }
  type();
}

// Cycle to next subtitle
function nextSubtitle() {
  subtitleIndex = (subtitleIndex + 1) % subtitles.length;
  typeSubtitle(subtitles[subtitleIndex], () => {
    setTimeout(nextSubtitle, 1200);
  });
}

// Start the animation on page load
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

// theme toggle function
const themeToggleBtn = document.getElementById("theme-toggle");
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  // Optionally, save preference
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-theme") ? "dark" : "light"
  );
});
// On load, restore preference
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}