import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { assert } from 'chai';
import sinon from 'sinon';
import { DialogueBox } from './DialogueBox';
import { NORMAL_ENDING, SECRET_ENDING, EASY_ENDING, MEDIUM_ENDING } from '../../engine/endings';
import { getStageDialogue, SECRET_BOSS_STAGE } from '../../engine/stages';

if (Meteor.isClient) {
  describe('DialogueBox story playback', function () {
    afterEach(() => { cleanup(); sinon.restore(); });

    it('reveals a line before advancing with clicks, Space, and Enter', function () {
      const finish = sinon.spy();
      render(<DialogueBox lines={[
        { speaker: 'player', text: 'First line.' },
        { speaker: 'enemy', speakerName: 'Timekeeper', text: 'Second line.' },
      ]} onFinish={finish} />);
      const panel = screen.getAllByRole('button')[0];
      fireEvent.click(panel);
      assert.equal(screen.getByTestId('dialogue-text').textContent, 'First line.');
      fireEvent.keyDown(window, { key: ' ' });
      assert.equal(screen.getByTestId('dialogue-speaker').textContent, 'Timekeeper');
      assert.equal(screen.getByTestId('dialogue-text').textContent, '');
      fireEvent.keyDown(window, { key: 'Enter' });
      assert.equal(screen.getByTestId('dialogue-text').textContent, 'Second line.');
      fireEvent.keyDown(window, { key: 'Enter' });
      assert.equal(finish.callCount, 1);
    });

    it('types text over time and completes Skip only once', function () {
      const clock = sinon.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
      const finish = sinon.spy();
      render(<DialogueBox lines={[{ speaker: 'narrator', text: 'Story' }]} onFinish={finish} />);
      act(() => clock.tick(50));
      assert.equal(screen.getByTestId('dialogue-text').textContent, 'St');
      fireEvent.click(screen.getByText('Skip'));
      fireEvent.click(screen.getByText('Skip'));
      assert.equal(finish.callCount, 1);
    });

    it('leaves Space and Enter available to other controls', function () {
      render(<><input aria-label="Setting" /><DialogueBox lines={[
        { speaker: 'player', text: 'Still typing.' },
      ]} /></>);
      fireEvent.keyDown(screen.getByLabelText('Setting'), { key: 'Enter' });
      assert.equal(screen.getByTestId('dialogue-text').textContent, '');
    });

    for (const [name, lines] of [
      ['opening', getStageDialogue(1, 'intro')],
      ['secret introduction', getStageDialogue(SECRET_BOSS_STAGE, 'intro')],
      ['normal ending', NORMAL_ENDING],
      ['easy opening', getStageDialogue(1, 'intro', 'easy')],
      ['easy ending', EASY_ENDING],
      ['medium ending', MEDIUM_ENDING],
      ['secret ending', SECRET_ENDING],
    ]) {
      it(`plays every line of the ${name} with the right speaker`, function () {
        const finish = sinon.spy();
        render(<DialogueBox lines={lines} enemyName="Current boss" onFinish={finish} />);
        const panel = screen.getAllByRole('button')[0];
        for (const line of lines) {
          const expectedName = line.speakerName ?? (
            line.speaker === 'player' ? 'You' : line.speaker === 'enemy' ? 'Current boss' : null
          );
          if (expectedName) {
            assert.equal(screen.getByTestId('dialogue-speaker').textContent, expectedName);
          } else {
            assert.isNull(screen.queryByTestId('dialogue-speaker'));
          }
          fireEvent.click(panel);
          assert.equal(screen.getByTestId('dialogue-text').textContent, line.text);
          fireEvent.click(panel);
        }
        assert.equal(finish.callCount, 1);
      });
    }
  });
}
