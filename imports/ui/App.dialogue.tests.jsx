import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { assert } from 'chai';
import sinon from 'sinon';
import { App } from './App';
import { UserDataCollection } from '../api/user-data/collections/UserDataCollection';
import { GameEngine } from '../engine/GameEngine';
import { getFinalStageFromDifficulty, SECRET_BOSS_STAGE } from '../engine/stages';
import { soundManager } from './soundManager';

if (Meteor.isClient) {
  describe('App dialogue flow', function () {
    let doc;
    let calls;
    beforeEach(function () {
      doc = { gameState: GameEngine.newGame('dialogue-ui-user', [], "hard") };
      sinon.stub(Meteor, 'user').returns({ _id: 'dialogue-ui-user' });
      sinon.stub(Meteor, 'subscribe').returns({ ready: () => true, stop: () => {} });
      sinon.stub(UserDataCollection, 'findOne').callsFake(() => doc);
      calls = sinon.stub(Meteor, 'call');
      for (const method of ['stopMusic', 'playBackgroundMusic', 'playStageClear', 'playGameOver']) {
        sinon.stub(soundManager, method);
      }
    });
    afterEach(() => { cleanup(); sinon.restore(); });

    function openGame(stage, result, flags = {}) {
      const engine = new GameEngine(doc.gameState);
      engine.stage = stage;
      engine.result = result;
      doc.gameState = { ...engine.toJSON(), ...flags };
      const view = render(<App />);
      fireEvent.click(screen.getByText('Continue'));
      return view;
    }

    it('holds cards, End Turn, and heartbeat until the opening finishes', function () {
      const clock = sinon.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
      const view = openGame(1, 'playing');
      assert.exists(screen.getByTestId('dialogue-box'));
      assert.isNull(screen.queryByText('End Turn'));
      fireEvent.click(screen.getAllByRole('button').find(button => button.hasAttribute('tabindex')));
      assert.equal(screen.getByTestId('dialogue-text').textContent, '11:59:59.');
      fireEvent.click(screen.getByText('Skip'));
      assert.isTrue(calls.calledWith('game.finishDialogue', { kind: 'intro' }));
      act(() => clock.tick(2000));
      assert.isFalse(calls.calledWith('game.applyTimerTick'));
      doc.gameState = { ...doc.gameState, dialogueSeen: true };
      view.rerender(<App />);
      assert.isNull(screen.queryByTestId('dialogue-box'));
      assert.exists(screen.getByText('End Turn'));
      act(() => clock.tick(2000));
      assert.isTrue(calls.calledWith('game.applyTimerTick'));
    });

    it('waits for the boss death animation before showing its outro', function () {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      const view = openGame(getFinalStageFromDifficulty("hard"), 'playing', { dialogueSeen: true, outroSeen: false });
      doc.gameState = { ...doc.gameState, result: 'win' };
      view.rerender(<App />);
      assert.isNull(screen.queryByTestId('dialogue-box'));
      assert.isNull(screen.queryByTestId('normal-ending'));
      act(() => clock.tick(1799));
      assert.isNull(screen.queryByTestId('dialogue-box'));
      act(() => clock.tick(1));
      assert.exists(screen.getByTestId('dialogue-box'));
      assert.isNull(screen.queryByTestId('normal-ending'));
    });

    it('shows the Merchant outro before the normal ending, then results', function () {
      const view = openGame(getFinalStageFromDifficulty("hard"), 'win', { outroSeen: false });
      assert.exists(screen.getByTestId('dialogue-box'));
      assert.isNull(screen.queryByTestId('normal-ending'));
      assert.isNull(screen.queryByText('Victory!'));
      doc.gameState = { ...doc.gameState, outroSeen: true };
      view.rerender(<App />);
      assert.exists(screen.getByTestId('normal-ending'));
      fireEvent.click(screen.getByText('Skip'));
      assert.isTrue(calls.calledWith('game.finishDialogue', { kind: 'ending' }));
      doc.gameState = { ...doc.gameState, endingSeen: true };
      view.rerender(<App />);
      assert.exists(screen.getByText('Victory!'));
    });

    it('ends an easy run after stage 4 with the ending for that mode', function () {
      const view = openGame(4, 'win', { difficulty: 'easy', outroSeen: true });
      assert.exists(screen.getByTestId('normal-ending'));
      assert.isNull(screen.queryByText('Victory!'));
      fireEvent.click(screen.getByText('Skip'));
      assert.isTrue(calls.calledWith('game.finishDialogue', { kind: 'ending' }));
      doc.gameState = { ...doc.gameState, endingSeen: true };
      view.rerender(<App />);
      assert.exists(screen.getByText('Victory!'));
      assert.exists(screen.getByText(/cleared all 4 stages/));
    });

    it('does not end a medium run at stage 4', function () {
      openGame(4, 'stageCleared', { difficulty: 'medium', outroSeen: true });
      assert.isNull(screen.queryByTestId('normal-ending'));
      assert.exists(screen.getByText('Next Enemy'));
    });

    it('counts stages against the run difficulty', function () {
      openGame(1, 'playing', { difficulty: 'medium', dialogueSeen: true });
      assert.exists(screen.getByText('Stage 1 / 5'));
    });

    it('shows the secret ending independently of normal completion, then results', function () {
      const view = openGame(SECRET_BOSS_STAGE, 'win', {
        outroSeen: true, endingSeen: true, secretEndingSeen: false,
      });
      assert.exists(screen.getByTestId('secret-ending'));
      assert.isNull(screen.queryByTestId('normal-ending'));
      assert.isNull(screen.queryByText('Victory!'));
      fireEvent.click(screen.getByText('Skip'));
      assert.isTrue(calls.calledWith('game.finishDialogue', { kind: 'ending' }));
      doc.gameState = { ...doc.gameState, secretEndingSeen: true };
      view.rerender(<App />);
      assert.exists(screen.getByText('Victory!'));
    });

    it('uses the stage-clear screen on the route to the hidden boss', function () {
      openGame(getFinalStageFromDifficulty("hard"), 'stageCleared', { outroSeen: true });
      assert.isNull(screen.queryByTestId('normal-ending'));
      assert.isNull(screen.queryByTestId('secret-ending'));
      assert.isNull(screen.queryByText('Victory!'));
      assert.exists(screen.getByText('Next Enemy'));
    });

    it('never plays an ending after defeat', function () {
      const view = openGame(SECRET_BOSS_STAGE, 'playing');
      doc.gameState = { ...doc.gameState, result: 'loss' };
      view.rerender(<App />);
      assert.exists(screen.getByText('Defeated!'));
      assert.isNull(screen.queryByTestId('secret-ending'));
    });

    it('does not offer Continue after the normal or secret ending was completed', function () {
      for (const stage of [getFinalStageFromDifficulty("hard"), SECRET_BOSS_STAGE]) {
        const engine = new GameEngine(doc.gameState);
        engine.stage = stage;
        engine.result = 'win';
        doc.gameState = {
          ...engine.toJSON(), outroSeen: true, endingSeen: true, secretEndingSeen: true,
        };
        render(<App />);
        assert.isNull(screen.queryByText('Continue'));
        cleanup();
      }
    });
  });
}
