// Readable-font accessibility setting.
// Applied as data-font="readable" on <html>; client/main.css swaps --game-font.
// Saved in localStorage so it survives reloads (per browser, not per account).

const STORAGE_KEY = 'otk.readableFont';

export function getReadableFont() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false; // storage blocked (e.g. private mode) - fall back to default font
  }
}

export function applyReadableFont(enabled) {
  if (enabled) {
    document.documentElement.dataset.font = 'readable';
  } else {
    delete document.documentElement.dataset.font;
  }
}

export function setReadableFont(enabled) {
  applyReadableFont(enabled);
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {
    // ignore - setting still applies for this session
  }
}
