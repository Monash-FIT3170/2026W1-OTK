import { expect } from 'chai';
import { Enemy } from './Enemy';
import { Undying } from './enemies/Undying';
import { Shield } from '../debuffs/Shield';

const LAYERS = Shield.SHIELD_LAYERS; // 3
const BASE = new Undying().health - LAYERS; // 140

function shieldsRemaining(enemy: Enemy) {
  return Shield.getRemainingLayers(enemy);
}

describe('Undying', () => {
  describe('spawning', () => {
    it('starts with full health plus shield layers', () => {
      const u = new Undying();
      expect(u.health).to.equal(BASE + LAYERS);
      expect(u.currentHealth).to.equal(BASE + LAYERS);
      expect(shieldsRemaining(u)).to.equal(LAYERS);
      expect(u.debuffs).to.include('shield');
    });

    it('restores shield state from saved health', () => {
      const u = new Undying({
        health: BASE + LAYERS,
        currentHealth: BASE + 1,
        shieldLayers: LAYERS
      });
      expect(shieldsRemaining(u)).to.equal(1);
    });

    it('migrates saved enemies to the Shield debuff', () => {
      const saved = new Undying({
        health: BASE + LAYERS, 
        currentHealth: BASE + 1,
        debuffs: [],
        shieldLayers: LAYERS 
      }).toJSON();
      const restored = new Undying(saved);

      expect(restored.debuffs).to.deep.equal(['shield']);
      expect(shieldsRemaining(restored)).to.equal(1);
    });
  });

  describe('while shielded', () => {
    it('uses the reusable Shield debuff', () => {
      const u = new Undying();

      expect(new Shield().modifyIncomingDamage(u, 100)).to.equal(1);
    });

    it('removes exactly 1 per hit regardless of damage', () => {
      const u = new Undying();
      u.takeDamage(100);
      expect(u.currentHealth).to.equal(BASE + LAYERS - 1);
      expect(shieldsRemaining(u)).to.equal(LAYERS - 1);
    });

    it('does not carry overflow damage into real health', () => {
      const u = new Undying({
        health: BASE + LAYERS, 
        currentHealth: BASE + 1,
        shieldLayers: LAYERS  }); // last layer
      u.takeDamage(50);
      expect(u.currentHealth).to.equal(BASE);
      expect(shieldsRemaining(u)).to.equal(0);
    });

    it('ignores zero and negative damage', () => {
      const u = new Undying();
      u.takeDamage(0);
      u.takeDamage(-5);
      expect(shieldsRemaining(u)).to.equal(LAYERS);
    });
  });

  describe('after shield breaks', () => {
    it('takes full damage normally', () => {
      const u = new Undying();
      for (let i = 0; i < LAYERS; i++) u.takeDamage(1);
      expect(shieldsRemaining(u)).to.equal(0);

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
