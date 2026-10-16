import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';
import { getFinalStageFromDifficulty, SECRET_BOSS_STAGE } from '../../../engine/stages';

// ---------------------------------------------------------------------------
// LOCAL TESTING ONLY - do not commit.
//
// Jumps the logged-in player straight to any boss dialogue so the story can be
// checked without winning every fight. Only runs under `meteor run` / `meteor
// test` (Meteor.isDevelopment); a production build refuses it.
//
// From the browser console, then click Continue (or just look at the game
// screen if you are already on it):
//
//   Meteor.call('game.devJump', { difficulty: 'easy', stage: 4, phase: 'outro' })
//
//   difficulty    'easy' | 'medium' | 'hard'
//   stage         1-4 (easy), 1-5 (medium), 1-6 (hard), 7 = hard's secret boss
//                 (which has no outro: its fight goes straight to its ending).
//                 Optional for phase 'ending' (defaults to the final stage).
//   phase         'intro'  - the dialogue before the fight (default)
//                 'outro'  - the dialogue after the boss falls
//                 'ending' - the victory story after the final boss's outro
//   usedPowerUps  false (default) = a run with no power-ups: Easy / Medium end
//                 with the Hard-mode teaser and Hard continues to the secret
//                 boss. true = a run that used power-ups (Hard's normal ending).
//
// Every jump starts from a fresh run and ignores what the account has already
// seen, so you can replay the same dialogue as often as you like. It does not
// change the account's seen-dialogue record.
// ---------------------------------------------------------------------------

function defeatBoss(engine, usedPowerUps) {
  engine.enemy.currentHealth = 0;
  // clearStage() records this into the run's boss recap, which is what decides
  // whether a Hard run continues to the secret boss.
  engine.powerUpsUsedThisStage = usedPowerUps ? 1 : 0;
  engine.clearStage();
}

Meteor.methods({
  'game.devJump': async function ({
    difficulty,
    stage,
    phase = 'intro',
    usedPowerUps = false,
  } = {}) {
    if (!Meteor.isDevelopment) {
      throw new Meteor.Error('game.devJump.notDevelopment', 'game.devJump only works in development.');
    }
    if (!this.userId) {
      throw new Meteor.Error('game.devJump.notLoggedIn', 'Must be logged in.');
    }
    check(difficulty, Match.OneOf('easy', 'medium', 'hard'));
    check(phase, Match.OneOf('intro', 'outro', 'ending'));
    check(usedPowerUps, Boolean);

    const final = getFinalStageFromDifficulty(difficulty);
    const hasSecret = difficulty === 'hard';
    if (stage === undefined && phase === 'ending') stage = final;
    check(stage, Match.Integer);

    const bad = (reason) => {
      throw new Meteor.Error('game.devJump.invalid', reason);
    };
    if (stage < 1 || stage > (hasSecret ? SECRET_BOSS_STAGE : final)) {
      bad(`${difficulty} has stages 1-${final}${hasSecret ? ` and the secret boss (${SECRET_BOSS_STAGE})` : ''}.`);
    }
    if (stage === SECRET_BOSS_STAGE && usedPowerUps) {
      bad('The secret boss is only reached on a run with no power-ups: use usedPowerUps: false.');
    }
    if (phase === 'ending' && stage !== final && stage !== SECRET_BOSS_STAGE) {
      bad(`${difficulty}'s ending plays after stage ${final}${hasSecret ? ` (or the secret boss, ${SECRET_BOSS_STAGE})` : ''}.`);
    }
    if (hasSecret && stage === final && phase === 'ending' && !usedPowerUps) {
      bad("Hard's normal ending needs usedPowerUps: true. With no power-ups the run goes on to the secret boss (stage 7).");
    }

    const existing = await UserDataCollection.findOneAsync({ userId: this.userId });

    // Start from a run that has seen nothing, then fight (instantly) up to the
    // wanted stage, leaving every dialogue on the way pending.
    const engine = new GameEngine(
      GameEngine.newGame(this.userId, existing?.nextDeck ?? null, difficulty, null)
    );
    while (engine.stage < stage) {
      engine.finishDialogue();
      defeatBoss(engine, usedPowerUps);
      engine.finishOutro();
      engine.advanceStage(null);
    }

    if (phase === 'outro' || phase === 'ending') {
      engine.finishDialogue();
      defeatBoss(engine, usedPowerUps);
      if (phase === 'ending') engine.finishOutro();
    }
    engine.touch();

    const gameState = engine.toJSON();
    if (existing) {
      await UserDataCollection.updateAsync({ userId: this.userId }, { $set: { gameState } });
    } else {
      await UserDataCollection.insertAsync({ userId: this.userId, gameState });
    }
    return `${difficulty} stage ${stage} ${phase} (result: ${gameState.result})`;
  },
});
