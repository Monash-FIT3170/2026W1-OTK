import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';
import { dialogueKey, getFinalStageFromDifficulty, SECRET_BOSS_STAGE } from '../../../engine/stages';

Meteor.methods({
  /**
   * The player finished (or skipped) a boss dialogue.
   *
   * - 'intro': the fight begins now. Until this runs, the stage is parked and
   *   every battle action is rejected (see GameEngine.isIntroPending).
   * - 'outro': releases the stage-clear / result screen.
   * - 'ending': releases normal or secret victory after its story sequence.
   *
   * Besides flipping the run's own flag, this records the dialogue in the
   * account-level seenDialogue map, so a restarted run does not show it again.
   *
   * Idempotent: a repeat call (double click, retried request) for dialogue
   * already marked seen is a no-op rather than an error.
   */
  'game.finishDialogue': async function ({ kind } = {}) {
    check(kind, Match.OneOf('intro', 'outro', 'ending'));

    if (!this.userId) {
      throw new Meteor.Error(
        'game.finishDialogue.notLoggedIn',
        'Must be logged in to finish dialogue.'
      );
    }

    const userData = await UserDataCollection.findOneAsync({
      userId: this.userId,
    });
    if (!userData?.gameState) {
      throw new Meteor.Error(
        'game.finishDialogue.noUserData',
        'No user data found.'
      );
    }

    const engine = new GameEngine(userData.gameState);

    if (kind === 'intro') {
      if (engine.result !== 'playing') {
        throw new Meteor.Error(
          'game.finishDialogue.notPending',
          'There is no intro dialogue to finish.'
        );
      }
      if (!engine.dialogueSeen) engine.finishDialogue();
    } else if (kind === 'outro') {
      if (engine.result !== 'stageCleared' && engine.result !== 'win') {
        throw new Meteor.Error(
          'game.finishDialogue.notPending',
          'There is no outro dialogue to finish.'
        );
      }
      if (!engine.outroSeen) engine.finishOutro();
    } else {
      if (
        engine.result !== 'win' ||
        !engine.outroSeen ||
        (engine.stage !== getFinalStageFromDifficulty(engine.difficulty) && engine.stage !== SECRET_BOSS_STAGE)
      ) {
        throw new Meteor.Error(
          'game.finishDialogue.notPending',
          'There is no victory ending to finish.'
        );
      }
      engine.finishEnding();
    }

    engine.touch();

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      {
        $set: {
          gameState: engine.toJSON(),
          [`seenDialogue.${dialogueKey(engine.stage, kind, engine.difficulty)}.${kind}`]: true,
        },
      }
    );
  },
});
