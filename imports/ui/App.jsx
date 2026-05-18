import React, { useState, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { UserDataCollection } from '../api/user-data/collections/UserDataCollection';
import CardHand from './cards/CardHand';
import { DeckViewer } from './cards/DeckViewer';
import { EnemyDisplay } from './components/EnemyDisplay';
import { PlayerDisplay } from './components/PlayerDisplay';
import { HealthBar } from './components/HealthBar';
import { LoginForm } from './auth/LoginForm';
import { AccountRegistrationForm } from './AccountRegistrationForm';
import { SaveGameButton } from './components/SaveGameButton';
import { GameBackground } from './components/GameBackground';
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
    const userData = user ? UserDataCollection.findOne({ userId: user._id }) : null;
    return { user, gameState: userData?.gameState ?? null, loading };
  });

  // Trigger hit animation whenever enemy HP decreases
  useEffect(() => {
    if (!gameState) return;
    const hp = gameState.enemy.currentHealth;
    if (prevHealthRef.current !== null && hp < prevHealthRef.current) {
      setIsTakingDamage(true);
      setTimeout(() => setIsTakingDamage(false), 400);
    }
    prevHealthRef.current = hp;
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
  /**
   * Saves the current GameState to the database.
   */
  const handleSaveGame = () => {
    Meteor.call('userData.saveGameState', { gameState }, (error) => {
      if (error) {
        console.error('Save game failed:', error);
        alert(error.reason || 'Failed to save game.');
        return;
      }

      alert('Game saved successfully.');
    });
  };

  // --- Victory screen ---
  if (result === 'win') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
        <h1 className="text-5xl font-bold text-yellow-400">Victory!</h1>
        <p className="text-slate-300 text-lg">You defeated {enemy.name}!</p>
        <button
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-lg transition-colors"
          onClick={() => Meteor.call('game.newGame')}
        >
          Play Again
        </button>
        <button
          className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
          onClick={() => Meteor.logout()}
        >
          Log Out
        </button>
      </div>
    );
  }

  // --- Defeat screen ---
  if (result === 'loss') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
        <h1 className="text-5xl font-bold text-red-500">Defeated!</h1>
        <p className="text-slate-300 text-lg">{enemy.name} survived your assault.</p>
        <button
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-lg transition-colors"
          onClick={() => Meteor.call('game.newGame')}
        >
          Try Again
        </button>
        <button
          className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
          onClick={() => Meteor.logout()}
        >
          Log Out
        </button>
      </div>
    );
  }

  // --- Main game screen ---
  return (
    //TODO: refactor to grab the bg from gamestate
    <GameBackground backgroundScene={scene}> 

      {/* Top bar: deck count, player name, end turn */}
      <div className="flex justify-between items-center px-6 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-slate-300 text-sm font-medium">
            Deck: <span className="text-white font-bold">{deck.length}</span> cards remaining
          </span>
          <DeckViewer cards={deck} />
        </div>
        <span className="text-slate-500 text-sm">{user.username}</span>
        <div className="flex gap-2">
          <SaveGameButton gameState={gameState} />
          <button
            className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg text-sm transition-colors"
            onClick={() => Meteor.call('game.endTurn')}
          >
            End Turn
          </button>
          <Settings />
        </div>
      </div>

      <div className="px-6 py-10">
        <HealthBar
          current={enemy.currentHealth}
          max={enemy.health}
          name={enemy.name}
        />
      </div>


      {/* Battle area: health bar + enemy sprite */}
      <div className="flex-1 relative flex flex-col justify-center px-8 py-6">
        <PlayerDisplay />
        <EnemyDisplay
          enemy={enemy}
          isVisible={true}
          isTakingDamage={isTakingDamage}
        />
      </div>

      {/* Card hand at the bottom */}
      <div className="p-4">
        <CardHand cards={hand} deckSize={deck.length} />
      </div>

    </GameBackground>
  );
};
