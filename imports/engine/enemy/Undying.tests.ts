import { expect } from 'chai';
import { Undying } from './enemies/Undying';

const BASE = Undying.baseHealth; // 140
const LAYERS = Undying.shieldLayers; // 3

describe('Undying', () => {
  describe('spawning', () => {
    it('starts with full health plus shield layers', () => {
      const u = new Undying();
      expect(u.health).to.equal(BASE + LAYERS);
      expect(u.currentHealth).to.equal(BASE + LAYERS);
      expect(u.shieldRemaining).to.equal(LAYERS);
    });

    it('restores shield state from saved health', () => {
      const u = new Undying({ currentHealth: BASE + 1 });
      expect(u.shieldRemaining).to.equal(1);
    });
  });

  describe('while shielded', () => {
    it('removes exactly 1 per hit regardless of damage', () => {
      const u = new Undying();
      u.takeDamage(100);
      expect(u.currentHealth).to.equal(BASE + LAYERS - 1);
      expect(u.shieldRemaining).to.equal(LAYERS - 1);
    });

    it('does not carry overflow damage into real health', () => {
      const u = new Undying({ currentHealth: BASE + 1 }); // last layer
      u.takeDamage(50);
      expect(u.currentHealth).to.equal(BASE);
      expect(u.shieldRemaining).to.equal(0);
    });

    it('ignores zero and negative damage', () => {
      const u = new Undying();
      u.takeDamage(0);
      u.takeDamage(-5);
      expect(u.shieldRemaining).to.equal(LAYERS);
    });
  });

  describe('after shield breaks', () => {
    it('takes full damage normally', () => {
      const u = new Undying();
      for (let i = 0; i < LAYERS; i++) u.takeDamage(1);
      expect(u.shieldRemaining).to.equal(0);

      u.takeDamage(30);
      expect(u.currentHealth).to.equal(BASE - 30);
    });
  });

  // describe('resetShield', () => {
  //   it('restores full health and all layers', () => {
  //     const u = new Undying();
  //     u.takeDamage(1);
  //     u.takeDamage(1);
  //     u.resetShield();
  //     expect(u.currentHealth).to.equal(BASE + LAYERS);
  //     expect(u.shieldRemaining).to.equal(LAYERS);
  //   });
  // });

  describe('card order puzzle', () => {
    const hitAll = (u: Undying, hits: number[]) =>
      hits.forEach((d) => u.takeDamage(d));

    it('dies when weak hits break the shield first', () => {
      const u = new Undying();
      hitAll(u, [1, 1, 1, 70, 70]);
      expect(u.currentHealth).to.be.at.most(0);
    });

    it('survives when big hits are wasted on the shield', () => {
      const u = new Undying();
      hitAll(u, [70, 70, 1, 1, 1]);
      expect(u.currentHealth).to.be.above(0);
    });
  });
});
