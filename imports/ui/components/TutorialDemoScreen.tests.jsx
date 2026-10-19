import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { expect } from 'chai';
import { TutorialDemoScreen } from './TutorialDemoScreen';
import { useTutorialEngine } from '../hooks/useTutorialEngine';
import { tutorialSteps } from '../tutorial/tutorialSteps';

if (Meteor.isClient) {
  describe('TutorialDemoScreen', function () {
    it('keeps free play open after Done until End Turn is pressed', async function () {
      let closed = false;
      let latestHand;
      let latestPlayCard;
      const captureEngine = () => {
        const engine = useTutorialEngine();
        latestHand = engine.hand;
        latestPlayCard = engine.playCard;
        return engine;
      };

      render(
        <TutorialDemoScreen
          onClose={() => {
            closed = true;
          }}
          _useTutorialEngine={captureEngine}
        />
      );

      // Advance through the introductory steps to the action-gated hand step.
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));

      // Playing a card advances the hand step automatically.
      act(() => {
        latestPlayCard(latestHand[0].uniqueId);
      });
      await waitFor(() => {
        expect(screen.getByText(tutorialSteps[4].title)).to.exist;
      });

      // Advance through the deck and End Turn explanation to free play.
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));

      expect(screen.getByText('Keep Practising')).to.exist;

      // End Turn does not exit while the final step's overlay is still showing.
      fireEvent.click(screen.getByRole('button', { name: 'End Turn' }));
      expect(closed).to.equal(false);

      // Done hides the overlay but leaves the demo open for free play.
      fireEvent.click(screen.getByRole('button', { name: 'Done' }));
      expect(screen.queryByText('Keep Practising')).to.not.exist;
      expect(closed).to.equal(false);

      // Cards remain playable without closing the tutorial.
      act(() => {
        latestPlayCard(latestHand[0].uniqueId);
      });
      expect(closed).to.equal(false);

      fireEvent.click(screen.getByRole('button', { name: 'End Turn' }));
      expect(closed).to.equal(true);
    });
  });
}
