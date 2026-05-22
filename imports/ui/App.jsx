import React, { useState, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { UserDataCollection } from '../api/user-data/collections/UserDataCollection';
import CardHand from './cards/CardHand';
import { EnemyDisplay } from './components/enemy/EnemyDisplay';
import { PlayerDisplay } from './components/PlayerDisplay';
import { HealthBar } from './components/enemy/HealthBar';
import { EndTurnButton } from './components/EndTurnButton';
import { DeckViewer } from './components/DeckViewer';
import { GameBackground } from './components/GameBackground';
import { ResultScreen } from './components/ResultScreen';
import { SaveGameButton } from './components/SaveGameButton';
import { LoginForm } from './auth/LoginForm';
import { AccountRegistrationForm } from './AccountRegistrationForm';

import { soundManager } from './soundManager';
import Settings from './components/Settings';

export const App = () => {
  const [showRegister, setShowRegister] = useState(false);

  // Track whether the enemy sprite should play its hit animation.
  // Toggled on whenever the server reports a drop in enemy HP.
  const [isTakingDamage, setIsTakingDamage] = useState(false);
  const prevHealthRef = useRef(null);

  // Subscribe to auth and game data reactively
  const { user, gameState, loading } = useTracker(() => {
    const userSub = Meteor.subscribe('auth.currentUser');
    const dataSub = Meteor.subscribe('userData');
    const loading = !userSub.ready() || !dataSub.ready();
    const user = Meteor.user();
    const userData = user
      ? UserDataCollection.findOne({ userId: user._id })
      : null;
    return { user, gameState: userData?.gameState ?? null, loading };
  });

  // Trigger hit animation whenever enemy HP decreases
  useEffect(() => {
    if (!gameState) return;
    const hp = gameState.enemy.currentHealth;
    let timer;
    if (prevHealthRef.current !== null && hp < prevHealthRef.current) {
      setIsTakingDamage(true);
      timer = setTimeout(() => setIsTakingDamage(false), 400);
    }
    prevHealthRef.current = hp;
    return () => clearTimeout(timer);
  }, [gameState?.enemy?.currentHealth]);

  // If logged in but no game state exists yet, start a new game automatically
  useEffect(() => {
    if (!loading && user && !gameState) {
      Meteor.call('game.newGame', (err) => {
        if (err) console.error('game.newGame failed:', err);
      });
    }
  }, [loading, user, gameState]);

  // Start background music when the game is active; stop on result
  useEffect(() => {
    if (!gameState) return;
    if (!gameState.result) {
      soundManager.playBackgroundMusic('spark-mandrill');
    } else {
      soundManager.stopMusic();
      if (gameState.result === 'win') soundManager.playStageClear();
      if (gameState.result === 'loss') soundManager.playGameOver();
    }
  }, [gameState?.result]);

  // --- Loading state ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  // --- Auth gate: show login or registration ---
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        {showRegister ? (
          <AccountRegistrationForm onShowLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onShowRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  // --- Waiting for game state to be created ---
  if (!gameState) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Starting game...</p>
      </div>
    );
  }

  const { hand, deck, enemy, result, scene } = gameState;

  // --- Victory / Defeat screens ---
  if (result === 'win' || result === 'loss') {
    return <ResultScreen result={result} enemyName={enemy.name} />;
  }

  // --- Main game screen ---
  return (
    <GameBackground backgroundScene={scene}>
      {/* Settings pinned to top-right corner */}
      <div className="absolute" style={{ right: 20, top: 30 }}>
        <Settings saveButton={<SaveGameButton gameState={gameState} />} />
      </div>

      <div className="px-6 py-4 mx-auto w-350">
        <HealthBar
          current={enemy.currentHealth}
          max={enemy.health}
          name={enemy.name}
        />
      </div>

      {/* Player display — positioned to match canvas coordinates derived from previous layout */}
      <div className="absolute " style={{ left: 400, bottom: 540 }}>
        <PlayerDisplay />
      </div>

      {/* Enemy display */}
      <div className="absolute" style={{ right: 400, bottom: 540 }}>
        <EnemyDisplay
          enemy={enemy}
          isVisible={true}
          isTakingDamage={isTakingDamage}
        />
      </div>

      {/* End turn button — absolute to match its former flex-flow position */}
      <div className="absolute" style={{ top: 530, right: 30 }}>
        <EndTurnButton />
      </div>

      {/* Card hand row: DeckViewer on left, hand on right */}
      <div
        className="absolute flex items-end"
        style={{ left: 370, right: 140, bottom: 20 }}
      >
        <CardHand cards={hand} deckSize={deck.length} />
      </div>

      <div
        className="absolute flex items-end pointer-events-none"
        style={{
          left: 87,
          right: 140,
          bottom: 163,
        }}
      >
        <DeckViewer cards={deck} />
      </div>
    </GameBackground>
  );
};
