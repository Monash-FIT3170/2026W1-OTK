import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';
import { getStageDialogue } from '../../../engine/stages';
import { getEnding } from '../../../engine/endings';

if (Meteor.isServer) {
  const userId = 'devjump-user';
  Meteor.isDevelopment = true;
  const call = (name, args = []) => Meteor.server.method_handlers[name].apply({ userId }, args);
  const load = async () => new GameEngine((await UserDataCollection.findOneAsync({ userId })).gameState);
  const cases = [];
  for (const [d, n] of [['easy', 4], ['medium', 5], ['hard', 6]])
    for (let s = 1; s <= n; s++) for (const p of ['intro', 'outro']) cases.push([d, s, p, false]);
  cases.push(['hard', 7, 'intro', false], ['hard', 7, 'ending', false],
    ['easy', 4, 'ending', false], ['medium', 5, 'ending', false], ['hard', 6, 'ending', true], ['hard', 3, 'intro', true]);

  describe('game.devJump', () => {
    beforeEach(() => UserDataCollection.removeAsync({}));
    cases.forEach(([difficulty, stage, phase, usedPowerUps]) => {
      it(`${difficulty} ${stage} ${phase}${usedPowerUps ? ' (power-ups)' : ''}`, async () => {
        await call('game.devJump', [{ difficulty, stage, phase, usedPowerUps }]);
        const e = await load();
        assert.equal(e.stage, stage);
        assert.equal(e.difficulty, difficulty);
        if (phase === 'intro') {
          assert.isTrue(e.isIntroPending());
          assert.isAbove(getStageDialogue(stage, 'intro', difficulty).length, 0);
        } else if (phase === 'outro') {
          assert.isTrue(e.isOutroPending());
        } else {
          assert.isTrue(e.isEndingPending());
          assert.isAbove(getEnding(difficulty, stage === 7, !usedPowerUps).length, 0);
        }
      });
    });
    it('rejects bad input and non-dev', async () => {
      for (const a of [{ difficulty: 'easy', stage: 5 }, { difficulty: 'hard', stage: 6, phase: 'ending' },
        { difficulty: 'hard', stage: 7, usedPowerUps: true }, { difficulty: 'easy', stage: 2, phase: 'ending' }]) {
        let err; try { await call('game.devJump', [a]); } catch (x) { err = x; }
        assert.ok(err, JSON.stringify(a));
      }
      Meteor.isDevelopment = false;
      let err; try { await call('game.devJump', [{ difficulty: 'easy', stage: 1 }]); } catch (x) { err = x; }
      Meteor.isDevelopment = true;
      assert.ok(err);
    });
  });
}
