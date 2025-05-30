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

// Get a random index, avoiding immediate repeats
function getRandomSubtitleIndex(arrLength) {
  return Math.floor(Math.random() * arrLength);
}

// Cycle to next random subtitle
function nextSubtitle() {
  subtitleIndex = getRandomSubtitleIndex(subtitles.length);
  typeSubtitle(subtitles[subtitleIndex], () => {
    setTimeout(nextSubtitle, 1200);
  });
}

