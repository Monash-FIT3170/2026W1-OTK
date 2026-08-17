// tutorialSteps.js
//
// Content for the tutorial walkthrough. Kept separate from TutorialOverlay.jsx
// so the wording can be reviewed/edited (client + dev sign-off) without
// touching component logic.
//
// Each step: { title, description }

export const tutorialSteps = [
  {
    title: 'Welcome to One Turn Kill',
    description:
      "OTK is a one-turn battle. You win by defeating the enemy before you end your turn — there's no second chance, so every card you play matters.",
  },
  {
    title: 'Your Hand',
    description:
      'These are the cards you can currently play. Each card has a cost — the number of cards you must draw from your deck before it can be played.',
  },
  {
    title: 'Your Deck',
    description:
      "Your deck is the pile of cards you haven't drawn yet. Playing a card draws that many cards from the deck into your hand first — so your deck shrinks as you build up your turn.",
  },
  {
    title: 'The Enemy',
    description:
      "This is your opponent for the run. Their health bar shows how much damage you still need to deal. Some enemies apply debuffs to punish you as the turn goes on, so don't take too long.",
  },
  {
    title: 'Ending Your Turn',
    description:
      "If you end your turn without defeating the enemy, it's an automatic loss. Only end your turn once you're confident your combo has done enough damage.",
  },
  {
    title: "You're Ready",
    description:
      'Study your hand, plan your combo, and defeat the enemy in one turn. Good luck!',
  },
];