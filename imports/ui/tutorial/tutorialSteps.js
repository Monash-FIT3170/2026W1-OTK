// tutorialSteps.js
//
// Content for the tutorial walkthrough. Kept separate from component code
// so the wording can be reviewed/edited (client + dev sign-off) without
// touching component logic.
//
// Each step: { target, title, description, action }
// `target` matches a data-tutorial-target attribute on a real element in
// either the main game screen (App.jsx) or the interactive demo screen
// (TutorialDemoScreen.jsx). `target: null` renders as a centered card.
// `action` is used only by the interactive demo (TutorialDemoScreen) to
// gate advancement on a real gameplay action instead of just a Next
// click: null | 'play-card' | 'end-turn'. TutorialOverlay (the read-only
// version shown on a real first game) ignores `action` entirely.

export const tutorialSteps = [
  {
    target: null,
    action: null,
    title: 'Welcome to One Turn Kill',
    description:
      "OTK is a one-turn battle. You win by defeating the enemy before you end your turn — there's no second chance, so every card you play matters.",
  },
  {
    target: 'health',
    action: null,
    title: 'Enemy Health',
    description:
      'This bar shows how much damage you still need to deal. Reduce it to zero before your turn ends to win.',
  },
  {
    target: 'enemy',
    action: null,
    title: 'The Enemy',
    description:
      "This is your opponent for the run. Some enemies apply debuffs to punish you as the turn goes on, so don't take too long.",
  },
  {
    target: 'hand',
    action: 'play-card',
    title: 'Your Hand',
    description:
      'These are the cards you can currently play. Try it now, and see what it does.',
  },
  {
    target: 'deck',
    action: null,
    title: 'Your Deck',
    description:
      'Notice your deck just got smaller — playing a card draws that many cards from the deck into your hand first, so your deck shrinks as you build up your turn.',
  },
  {
    target: 'end-turn',
    action: null,
    title: 'Ending Your Turn',
    description:
      "When you're ready to finish your turn, click End Turn. In a real match, only do this once you've defeated the enemy — ending your turn early is an automatic loss.",
  },
  {
    target: null,
    action: null,
    title: "You're Ready",
    description:
      'Study your hand, plan your combo, and defeat the enemy in one turn. Good luck!',
  },
];