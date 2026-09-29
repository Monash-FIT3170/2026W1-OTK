import { assert } from 'chai';
import { GameEngine } from '../GameEngine';
import { Merchant } from '../enemy/enemies/Merchant';
import { ShortSword } from '../card/ShortSword';
import { debuffRegistry } from './DebuffRegistry';
import { Inflation } from './Inflation';

function buildEngine(handSize) {
  return new GameEngine({
    userId: 'inflation-test-user',
    stage: 4,
    deck: [],
    hand: Array.from({ length: handSize }, () => new ShortSword().toJSON()),
    enemy: new Merchant().toJSON(),
    scene: 'underpass-overlaid',
    result: 'playing',
  });
}

function playCards(engine, count) {
  for (let i = 0; i < count; i++) {
    engine.executeCard(engine.hand[0].uniqueId);
  }
}

describe('Inflation', function () {
  it('registers itself and can be reconstructed by id', function () {
    assert.instanceOf(debuffRegistry.create('inflation'), Inflation);
  });

  it('is attached to a fresh Merchant but not re-added to a restored one', function () {
    assert.deepEqual(new Merchant().debuffs, ['inflation']);
    assert.deepEqual(new Merchant({ debuffs: [] }).debuffs, []);
  });

  it('does not change costs before the third card is played', function () {
    const engine = buildEngine(3);
    playCards(engine, 2);

    assert.equal(engine.hand[0].currentCost, 1);
  });

  it('raises the cost of every card in hand on the third card played', function () {
    const engine = buildEngine(5);
    playCards(engine, 3);

    assert.isTrue(engine.hand.every((card) => card.currentCost === 2));
  });

  it('triggers again on every third card played', function () {
    const engine = buildEngine(7);
    playCards(engine, 6);

    assert.equal(engine.hand[0].currentCost, 3);
  });
});
