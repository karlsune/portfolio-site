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
function getRandomSubtitleIndex(prevIndex, arrLength) {
  let idx;
  do {
    idx = Math.floor(Math.random() * arrLength);
  } while (arrLength > 1 && idx === prevIndex);
  return idx;
}

// Cycle to next random subtitle
function nextSubtitle() {
  const prevIndex = subtitleIndex;
  subtitleIndex = getRandomSubtitleIndex(prevIndex, subtitles.length);
  typeSubtitle(subtitles[subtitleIndex], () => {
    setTimeout(nextSubtitle, 1200);
  });
}

