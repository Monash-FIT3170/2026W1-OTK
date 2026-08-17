import React from 'react';
import { GameBackground } from './GameBackground';
import { HealthBar } from './enemy/HealthBar';
import { PlayerDisplay } from './PlayerDisplay';
import { EnemyDisplay } from './enemy/EnemyDisplay';
import Card from '../cards/Card';
import { TutorialOverlay } from './TutorialOverlay';
import {
  tutorialDemoEnemy,
  tutorialDemoHand,
  tutorialDemoDeckSize,
} from '../tutorial/tutorialDemoData';

// A visual stand-in for the real battle screen, used only as a backdrop
// for the tutorial walkthrough. Deliberately does NOT reuse CardHand or
// EndTurnButton, since both of those call real Meteor methods
// (game.executeCard / game.drawCards / game.endTurn) with no way to
// intercept them — using them here could mutate the player's actual
// save. Everything below is static/non-interactive and backed by fixed
// mock data from tutorialDemoData.js, never UserDataCollection.
export const TutorialDemoScreen = ({ onClose }) => {
  return (
    <GameBackground backgroundScene="underpass-overlaid">
      <div className="px-6 py-4 mx-auto w-350">
        <HealthBar
          current={tutorialDemoEnemy.currentHealth}
          max={tutorialDemoEnemy.health}
          name={tutorialDemoEnemy.name}
        />
      </div>

      <div className="absolute" style={{ left: 400, bottom: 540 }}>
        <PlayerDisplay />
      </div>

      <div className="absolute" style={{ right: 400, bottom: 540 }}>
        <EnemyDisplay enemy={tutorialDemoEnemy} isVisible={true} />
      </div>

      {/* Static End Turn look-alike — not the real EndTurnButton, so it
          can't call the real game.endTurn method. */}
      <div className="absolute" style={{ top: 530, right: 30 }}>
        <div className="px-8 py-4 bg-red-700/60 text-white font-semibold rounded-lg text-xl cursor-not-allowed select-none">
          End Turn
        </div>
      </div>

      {/* Static hand — plain Card display components, not CardHand, so
          nothing here can call real Meteor methods. */}
      <div
        className="absolute flex items-end gap-2 pointer-events-none"
        style={{ left: 370, right: 140, bottom: 20 }}
      >
        {tutorialDemoHand.map((cardProps) => (
          <Card key={cardProps.uniqueId} cardProps={cardProps} width={180} />
        ))}
      </div>

      <div
        className="absolute flex items-end pointer-events-none"
        style={{ left: 87, right: 140, bottom: 163 }}
      >
        <div className="text-white text-sm">
          Deck: {tutorialDemoDeckSize} cards
        </div>
      </div>

      <TutorialOverlay onClose={onClose} />
    </GameBackground>
  );
};

export default TutorialDemoScreen;
