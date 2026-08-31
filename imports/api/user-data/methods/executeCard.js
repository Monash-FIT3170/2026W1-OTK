import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { check, Match } from 'meteor/check';
import { GameEngine } from '../../../engine/GameEngine';
import { debuffRegistry } from '../../../engine/debuffs';

Meteor.methods({
  'game.executeCard': async function ({ uniqueCardId, selectedCardIds }) {
    check(uniqueCardId, String);
    check(selectedCardIds, Match.Optional([String]));

    if (!this.userId) {
      throw new Meteor.Error(
        'game.executeCard.notLoggedIn',
        'Must be logged in.'
      );
    }

    const userData = await UserDataCollection.findOneAsync({
      userId: this.userId,
    });
    if (!userData) {
      throw new Meteor.Error(
        'game.executeCard.noUserData',
        'No user data found.'
      );
    }

    const engine = new GameEngine(userData.gameState);
    engine.rebaseAfterAway();

    const card = engine.getCard(uniqueCardId);
    if (!card.isPlayable()) {
      throw new Meteor.Error(
        'game.executeCard.cardFrozen',
        'Frozen cards cannot be played.'
      );
    }
    engine.executeCard(uniqueCardId, selectedCardIds ?? []);

    if (engine.isEnemyDefeated()) {
      // Records the recap entry and moves the run to 'stageCleared' or 'win'.
      // Must run before the state is serialised below.
      engine.clearStage();
    } else if (
      (engine.enemy.debuffs || []).includes('timer') &&
      !engine.enemy.timerDebuffActive
    ) {
      // The enemy still has the 'timer' debuff id but the timer fields are not
      // active (could happen after serialization or a tick), so re-arm it to
      // keep the UI and effects consistent across plays. Skipped on a corpse.
      debuffRegistry.create('timer').activateDebuff(engine);
    }

    engine.touch();

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: engine.toJSON() } }
    );
  },
});
