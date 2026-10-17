/**
 * Decides whether the tutorial overlay should auto-show when a player
 * starts a new game.
 *
 * Only players who have never completed/dismissed the tutorial see it
 * automatically. `profile.hasSeenTutorial` is set server-side by the
 * `user.markTutorialSeen` method and published via `auth.currentUser`.
 * Players can still replay it any time from the landing page Tutorial button.
 *
 * @param {Object|null|undefined} user - The current Meteor user document.
 * @returns {boolean} true if the tutorial should auto-show.
 */
export const shouldAutoShowTutorial = (user) =>
  !!user && !user.profile?.hasSeenTutorial;
