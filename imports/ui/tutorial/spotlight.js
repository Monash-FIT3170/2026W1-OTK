// spotlight.js
//
// Shared DOM-measurement and positioning math for the tutorial spotlight
// effect. Used by both TutorialOverlay.jsx (read-only, shown automatically
// on a player's real first game) and TutorialDemoScreen.jsx (interactive,
// manually opened from the landing page).

export const HIGHLIGHT_PADDING = 8;
export const CARD_WIDTH = 320;
export const VIEWPORT_MARGIN = 16;
export const GAP_FROM_TARGET = 14;

// Finds the on-screen element for a given target id and returns its
// bounding box in viewport coordinates, or null if there's no target id
// or no matching element is currently in the DOM.
export function measureTarget(targetId) {
  if (!targetId) return null;
  const el = document.querySelector(`[data-tutorial-target="${targetId}"]`);
  if (!el) return null;
  return el.getBoundingClientRect();
}

// Style for the highlight box drawn around a measured target rect. The
// large box-shadow spread both dims the rest of the screen and cuts the
// "hole" around the target, without needing a separate overlay element.
export function computeHighlightStyle(rect) {
  return {
    position: 'fixed',
    top: rect.top - HIGHLIGHT_PADDING,
    left: rect.left - HIGHLIGHT_PADDING,
    width: rect.width + HIGHLIGHT_PADDING * 2,
    height: rect.height + HIGHLIGHT_PADDING * 2,
    borderRadius: 10,
    border: '2px solid white',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
    pointerEvents: 'none',
    zIndex: 50,
    transition:
      'top 0.2s ease, left 0.2s ease, width 0.2s ease, height 0.2s ease',
  };
}

// Style for the step card, positioned next to the target rect — below by
// default, flipped above if there isn't enough room, clamped
// horizontally so it never runs off-screen.
//
// pinToTop forces the card to a fixed position near the top of the
// screen instead, ignoring the target rect entirely. Used for steps
// (like "Your Hand") where the default near-target position can end up
// underneath real, functional gameplay UI that appears mid-step — e.g.
// SelectionPanel's "ok" confirm button, which renders roughly centered
// on screen. That UI lives inside GameBackground's CSS-scaled ancestor,
// which creates its own stacking context — z-index alone can't reliably
// win against content portaled outside that context (see TutorialOverlay
// and TutorialDemoScreen), so this avoids the overlap positionally
// instead of fighting over stacking order.
export function computeCardPositionStyle(rect, { pinToTop = false } = {}) {
  const viewportWidth = window.innerWidth;

  if (pinToTop) {
    return {
      position: 'fixed',
      top: VIEWPORT_MARGIN + 8,
      left: '50%',
      transform: 'translateX(-50%)',
      width: CARD_WIDTH,
      zIndex: 51,
    };
  }

  const viewportHeight = window.innerHeight;
  const spaceBelow = viewportHeight - rect.bottom;
  const placeBelow = spaceBelow > 220 || spaceBelow > rect.top;

  let left = rect.left + rect.width / 2 - CARD_WIDTH / 2;
  left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(left, viewportWidth - CARD_WIDTH - VIEWPORT_MARGIN)
  );

  return placeBelow
    ? {
        position: 'fixed',
        top: rect.bottom + GAP_FROM_TARGET,
        left,
        width: CARD_WIDTH,
        zIndex: 51,
      }
    : {
        position: 'fixed',
        top: rect.top - GAP_FROM_TARGET,
        left,
        width: CARD_WIDTH,
        transform: 'translateY(-100%)',
        zIndex: 51,
      };
}