import React from 'react';
import { Meteor } from 'meteor/meteor';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { TutorialDemoScreen } from './TutorialDemoScreen';
import { tutorialSteps } from '../tutorial/tutorialSteps';

if (Meteor.isClient) {
  describe('TutorialDemoScreen', function () {
    it('keeps free play open until End Turn is pressed on the final step', async function () {
      let closed = false;
      render(
        <TutorialDemoScreen
          onClose={() => {
            closed = true;
          }}
        />
      );

      // Advance through the introductory steps to the action-gated hand step.
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));

      // Playing a card advances the hand step automatically.
      fireEvent.click(screen.getAllByRole('button', { name: /^Play / })[0]);
      await waitFor(() => {
        expect(screen.getByText(tutorialSteps[4].title)).to.exist;
      });

      // Advance through the deck and End Turn explanation to free play.
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));

      expect(screen.getByText('Keep Practising')).to.exist;
      expect(screen.queryByRole('button', { name: 'Done' })).to.not.exist;

      // Cards remain playable without closing the tutorial.
      fireEvent.click(screen.getAllByRole('button', { name: /^Play / })[0]);
      expect(screen.getByText('Keep Practising')).to.exist;
      expect(closed).to.equal(false);

      fireEvent.click(screen.getByRole('button', { name: 'End Turn' }));
      expect(closed).to.equal(true);
    });
  });
}
