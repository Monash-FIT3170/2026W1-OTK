import { assert } from 'chai';
import { DeckBuilder } from '../DeckBuilder';
import { GameEngine } from '../GameEngine';
import { Goblin } from '../enemy/enemies/Goblin';
import { Debuff } from './Debuff';
import { debuffRegistry } from './DebuffRegistry';
import { Freeze } from './Freeze';

function buildEngine() {
  return new GameEngine({
    userId: 'freeze-test-user',
    stage: 1,
    deck: DeckBuilder.buildStartingDeck(),
    hand: [],
    enemy: new Goblin().toJSON(),
    scene: 'underpass-overlaid',
    result: 'playing',
  });
}

describe('Freeze', function () {
  it('extends Debuff and attaches to an enemy idempotently', function () {
    const freeze = new Freeze();
    const goblin = new Goblin();

    freeze.applyTo(goblin);
    freeze.applyTo(goblin);

    assert.instanceOf(freeze, Debuff);
    assert.deepEqual(goblin.debuffs, ['freeze']);
  });

  it('registers itself and can be reconstructed by id', function () {
    assert.instanceOf(debuffRegistry.create('freeze'), Freeze);
  });

  it('freezes exactly one eligible card in the deck', function () {
    const engine = buildEngine();

    new Freeze().activateDebuff(engine);

    assert.equal(engine.deck.filter((card) => card.isFrozen).length, 1);
  });

  it('does nothing when every deck card is already frozen', function () {
    const engine = buildEngine();
    engine.deck.forEach((card) => {
      card.isFrozen = true;
    });

    new Freeze().activateDebuff(engine);

    assert.isTrue(engine.deck.every((card) => card.isFrozen));
  });

  it('persists the frozen state when game state is reconstructed', function () {
    const engine = buildEngine();
    new Freeze().activateDebuff(engine);

    const restoredEngine = new GameEngine(engine.toJSON());

    assert.equal(
      restoredEngine.deck.filter((card) => card.isFrozen).length,
      1
    );
  });

  it('prevents a frozen card from being played', function () {
    const engine = buildEngine();
    const frozenCard = engine.deck.shift();
    frozenCard.isFrozen = true;
    engine.hand.push(frozenCard);

    assert.throws(
      () => engine.drawCost(frozenCard.uniqueId),
      'is frozen'
    );
    assert.throws(
      () => engine.executeCard(frozenCard.uniqueId),
      'is frozen'
    );
  });

  it('attaches and activates Freeze once when a new game is created', function () {
    const gameState = GameEngine.newGame('freeze-test-user');
    const allCards = [...gameState.deck, ...gameState.hand];

    assert.deepEqual(gameState.enemy.debuffs, ['freeze']);
    assert.equal(allCards.filter((card) => card.isFrozen).length, 1);

    const restoredEngine = new GameEngine(gameState);
    const restoredCards = [...restoredEngine.deck, ...restoredEngine.hand];
    assert.equal(restoredCards.filter((card) => card.isFrozen).length, 1);
  });
});
