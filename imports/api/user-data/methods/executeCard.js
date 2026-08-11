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
    const card = engine.getCard(uniqueCardId);
    if (!card.isPlayable()) {
      throw new Meteor.Error(
        'game.executeCard.cardFrozen',
        'Frozen cards cannot be played.'
      );
    }
    engine.executeCard(uniqueCardId, selectedCardIds ?? []);

    // If the enemy still has the 'timer' debuff id but the timer fields
    // are not active (could happen after serialization or a tick), make
    // sure it's activated so the UI and effects persist across plays.
    if ((engine.enemy.debuffs || []).includes('timer') && !engine.enemy.timerDebuffActive) {
      debuffRegistry.create('timer').activateDebuff(engine);
    }

    const newState = engine.toJSON();
    if (engine.isEnemyDefeated()) {
      newState.result = 'win';
    }

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: newState } }
    );
  },
});
