import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { TutorialOverlay } from './TutorialOverlay.jsx';
import { tutorialSteps } from '../tutorial/tutorialSteps';

const sampleHand = [
  { uniqueId: 'a', name: 'Card A' },
  { uniqueId: 'b', name: 'Card B' },
];

const handStepIndex = tutorialSteps.findIndex((s) => s.action === 'play-card');

// Advances the already-rendered overlay from its current step up to (but
// not including) targetIndex — clicking Next for ordinary steps, and
// simulating a real card play (via rerender with an updated hand prop,
// same as App.jsx would pass down from a live gameState) at the gated
// "Your Hand" step.
//
// IMPORTANT: onClose must be forwarded on every rerender call here.
// rerender() replaces ALL props, not just the ones that changed — an
// earlier version of this helper hardcoded a fresh no-op onClose on its
// internal rerender call, which silently overwrote the real test's
// onClose for the rest of that render's lifetime, making any later
// "calls onClose" assertion fail even though the component itself was
// working correctly.
function advanceTo(targetIndex, rerender, hand, onClose) {
  let currentHand = hand;
  for (let i = 0; i < targetIndex; i++) {
    if (i === handStepIndex) {
      currentHand = currentHand.slice(1); // simulate playing the first card
      rerender(<TutorialOverlay onClose={onClose} hand={currentHand} />);
    } else {
      fireEvent.click(screen.getByText('Next'));
    }
  }
  return currentHand;
}

if (Meteor.isClient) {
  describe('TutorialOverlay', function () {
    it('renders the first step title on open', function () {
      render(<TutorialOverlay onClose={() => {}} />);
      assert.exists(screen.getByText(tutorialSteps[0].title));
    });

    it('shows the Back button disabled on the first step', function () {
      render(<TutorialOverlay onClose={() => {}} />);
      assert.isTrue(screen.getByText('Back').disabled);
    });

    it('advances to the next step when Next is clicked', function () {
      render(<TutorialOverlay onClose={() => {}} />);
      fireEvent.click(screen.getByText('Next'));
      assert.exists(screen.getByText(tutorialSteps[1].title));
    });

    it('goes back to the previous step when Back is clicked', function () {
      render(<TutorialOverlay onClose={() => {}} />);
      fireEvent.click(screen.getByText('Next'));
      fireEvent.click(screen.getByText('Back'));
      assert.exists(screen.getByText(tutorialSteps[0].title));
    });

    it('calls onClose when Skip is clicked', function () {
      let closed = false;
      render(<TutorialOverlay onClose={() => { closed = true; }} />);
      fireEvent.click(screen.getByText('Skip'));
      assert.isTrue(closed);
    });

    it('shows "Done" instead of "Next" on the last step', function () {
      const onClose = () => {};
      const { rerender } = render(
        <TutorialOverlay onClose={onClose} hand={sampleHand} />
      );
      advanceTo(tutorialSteps.length - 1, rerender, sampleHand, onClose);
      assert.exists(screen.getByText('Done'));
    });

    it('calls onClose when Done is clicked on the last step', function () {
      let closed = false;
      const onClose = () => { closed = true; };
      const { rerender } = render(
        <TutorialOverlay onClose={onClose} hand={sampleHand} />
      );
      advanceTo(tutorialSteps.length - 1, rerender, sampleHand, onClose);
      fireEvent.click(screen.getByText('Done'));
      assert.isTrue(closed);
    });

    it('falls back to a centered card when a step has no matching target element in the DOM', function () {
      render(<TutorialOverlay onClose={() => {}} />);
      assert.exists(screen.getByText(tutorialSteps[0].title));
      assert.exists(screen.getByText('Next'));
    });

    it('still shows step content when a real target element is present in the DOM', function () {
      const targetStepIndex = tutorialSteps.findIndex((s) => s.target);
      assert.isAbove(
        targetStepIndex,
        -1,
        'expected at least one step with a target for this test to be meaningful'
      );

      const target = document.createElement('div');
      target.setAttribute(
        'data-tutorial-target',
        tutorialSteps[targetStepIndex].target
      );
      document.body.appendChild(target);

      const onClose = () => {};
      const { rerender } = render(
        <TutorialOverlay onClose={onClose} hand={sampleHand} />
      );
      advanceTo(targetStepIndex, rerender, sampleHand, onClose);

      assert.exists(screen.getByText(tutorialSteps[targetStepIndex].title));

      document.body.removeChild(target);
    });

    describe('Your Hand step (action-gated on a real card play)', function () {
      it('hides the Next button while waiting for a card to be played', function () {
        const onClose = () => {};
        const { rerender } = render(
          <TutorialOverlay onClose={onClose} hand={sampleHand} />
        );
        advanceTo(handStepIndex, rerender, sampleHand, onClose);
        assert.isNull(screen.queryByText('Next'));
      });

      it('still allows Back while waiting for the action', function () {
        const onClose = () => {};
        const { rerender } = render(
          <TutorialOverlay onClose={onClose} hand={sampleHand} />
        );
        advanceTo(handStepIndex, rerender, sampleHand, onClose);
        assert.isFalse(screen.getByText('Back').disabled);
      });

      it('advances automatically once a baseline card disappears from the real hand', function () {
        const onClose = () => {};
        const { rerender } = render(
          <TutorialOverlay onClose={onClose} hand={sampleHand} />
        );
        advanceTo(handStepIndex, rerender, sampleHand, onClose);

        // Simulate the player actually playing a card — it's removed
        // from the real hand and the new hand is passed down as a prop,
        // exactly as App.jsx would after a real game.executeCard call.
        rerender(
          <TutorialOverlay onClose={onClose} hand={[sampleHand[1]]} />
        );

        assert.exists(screen.getByText(tutorialSteps[handStepIndex + 1].title));
      });

      it('does not advance when the hand changes but no baseline card was actually removed', function () {
        const onClose = () => {};
        const { rerender } = render(
          <TutorialOverlay onClose={onClose} hand={sampleHand} />
        );
        advanceTo(handStepIndex, rerender, sampleHand, onClose);

        // Hand grew (e.g. drawing cost cards happens before a played
        // card is removed) but nothing from the baseline disappeared —
        // this should NOT be mistaken for a completed play.
        rerender(
          <TutorialOverlay
            onClose={onClose}
            hand={[...sampleHand, { uniqueId: 'c', name: 'Card C' }]}
          />
        );

        assert.exists(screen.getByText(tutorialSteps[handStepIndex].title));
      });
    });

    describe('Ending Your Turn step', function () {
      it('is description-only — Next is available immediately, no action required', function () {
        const endTurnStepIndex = tutorialSteps.findIndex(
          (s) => s.title === 'Ending Your Turn'
        );
        assert.isAbove(endTurnStepIndex, -1);

        const onClose = () => {};
        const { rerender } = render(
          <TutorialOverlay onClose={onClose} hand={sampleHand} />
        );
        advanceTo(endTurnStepIndex, rerender, sampleHand, onClose);

        assert.exists(screen.getByText(tutorialSteps[endTurnStepIndex].title));
        assert.exists(screen.getByText('Next'));
      });
    });
  });
}