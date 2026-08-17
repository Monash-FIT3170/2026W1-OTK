import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { TutorialOverlay } from './TutorialOverlay.jsx';
import { tutorialSteps } from '../tutorial/tutorialSteps';

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
      render(<TutorialOverlay onClose={() => {}} />);
      for (let i = 0; i < tutorialSteps.length - 1; i++) {
        fireEvent.click(screen.getByText('Next'));
      }
      assert.exists(screen.getByText('Done'));
    });

    it('calls onClose when Done is clicked on the last step', function () {
      let closed = false;
      render(<TutorialOverlay onClose={() => { closed = true; }} />);
      for (let i = 0; i < tutorialSteps.length - 1; i++) {
        fireEvent.click(screen.getByText('Next'));
      }
      fireEvent.click(screen.getByText('Done'));
      assert.isTrue(closed);
    });
  });
}