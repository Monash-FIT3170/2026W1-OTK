import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

// Collapses the drawCards -> executeCard sequence into a single client
// round-trip. When the card needs target selection we stop after drawCards
// and return its result; the client then calls game.executeCard on confirm,
// exactly as before. Both sub-handlers run with this method's DDP context
// (this.userId etc.) and do their own auth/validation.
Meteor.methods({
  'game.playCard': async function ({ uniqueCardId, selectedCardIds }) {
    check(uniqueCardId, String);
    check(selectedCardIds, Match.Optional([String]));

    const handlers = Meteor.server.method_handlers;

    const drawResult = await handlers['game.drawCards'].call(this, {
      uniqueCardId,
    });
    if (drawResult && drawResult.requiresSelection) {
      return drawResult;
    }

    await handlers['game.executeCard'].call(this, {
      uniqueCardId,
      selectedCardIds: selectedCardIds ?? [],
    });
    return { requiresSelection: false };
  },
});
