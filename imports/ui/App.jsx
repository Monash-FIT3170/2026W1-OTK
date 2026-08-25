import React, { useState, useEffect } from 'react';
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
import { LandingPage } from './LandingPage';
import { TutorialOverlay } from './components/TutorialOverlay';
import { TutorialDemoScreen } from './components/TutorialDemoScreen';
import { DeckBuilder } from './components/deck/DeckBuilder';
import { buildAvailableCards } from './../engine/DeckBuilderCards';
import { DeckBuilder as DeckBuilderEngine } from '../engine/DeckBuilder';

import { useGameSounds } from './hooks/useGameSounds';
import Settings from './components/Settings';

export const App = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  // Manually-opened tutorial (landing page button) is a fully separate,
  // ephemeral demo screen — it never touches the player's real save.
  const [showTutorialDemo, setShowTutorialDemo] = useState(false);

  // Set true only when the player just started a brand-new game (not
  // Continue). The auto-tutorial triggers off this path — every time,
  // not just a player's first-ever game, since re-showing it on every
  // New Game (e.g. after trying a new strategy, or a returning player
  // wanting a refresher) makes more sense for this kind of game than a
  // strict one-time-only onboarding flow.
  const [justStartedNewGame, setJustStartedNewGame] = useState(false);
  const [showDeckBuilder, setShowDeckBuilder] = useState(false);

  // Subscribe to auth and game data reactively
  const { user, userData, gameState, loading } = useTracker(() => {
    const userSub = Meteor.subscribe('auth.currentUser');
    const dataSub = Meteor.subscribe('userData');
    const loading = !userSub.ready() || !dataSub.ready();
    const user = Meteor.user();
    const userData = user
      ? UserDataCollection.findOne({ userId: user._id })
      : null;
    return { user, userData, gameState: userData?.gameState ?? null, loading };
  });

  // If logged in but no game state exists yet, start a new game automatically
  useEffect(() => {
    if (!loading && user && !gameState && !showLanding) {
      Meteor.call('game.newGame', (err) => {
        if (err) console.error('game.newGame failed:', err);
      });
    }
  }, [loading, user, gameState, showLanding]);

  // Auto-show the tutorial every time the player starts a brand-new game
  // (never on Continue).
  useEffect(() => {
    if (!loading && user && gameState && !showLanding && justStartedNewGame) {
      setShowTutorial(true);
      setJustStartedNewGame(false);
    }
  }, [loading, user, gameState, showLanding, justStartedNewGame]);


  useGameSounds(gameState?.result);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    Meteor.call('user.markTutorialSeen', (err) => {
      if (err) console.error('user.markTutorialSeen failed:', err);
    });
  };

  // Manually-opened tutorial from the landing page. Fully ephemeral —
  // no Meteor calls, no reads or writes to the player's real save.
  // Renders as its own top-level screen (see the showTutorialDemo branch
  // below), completely independent of showLanding/gameState.
  const handleOpenTutorial = () => {
    setShowTutorialDemo(true);
  };

  const handleCloseTutorialDemo = () => {
    setShowTutorialDemo(false);
    Meteor.call('user.markTutorialSeen', (err) => {
      if (err) console.error('user.markTutorialSeen failed:', err);
    });
  };

  // Called by LandingPage when leaving for the main game screen.
  // isNewGame should be true only for the New Game/Start action, never
  // for Continue — this is what the auto-tutorial trigger keys off.
  const handleStart = (isNewGame = false) => {
    setShowLanding(false);
    if (isNewGame) setJustStartedNewGame(true);
  };

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

  // --- Manually-opened tutorial demo: fully ephemeral, independent of
  // showLanding/gameState. Never touches the player's real save. ---
  if (showTutorialDemo) {
    return <TutorialDemoScreen onClose={handleCloseTutorialDemo} />;
  }

  // --- Landing page: shown once user is authenticated, before game starts ---
  if (showLanding) {
    return (
            <LandingPage
        hasSave={gameState?.result === 'playing'}
        onStart={handleStart}
        onOpenTutorial={handleOpenTutorial}
        onEditDeck={() => {
          setShowLanding(false);
          setShowDeckBuilder(true);
        }}
      />
    );
  }
  if (showDeckBuilder) {
    return (
      <DeckBuilder
        availableCards={buildAvailableCards()}
        initialDeck={userData?.nextDeck ?? gameState?.baseDeck ?? DeckBuilderEngine.buildStartingDeck() ?? []}
        onConfirm={(newDeck) => {
          Meteor.call('userData.saveNextDeck', newDeck, (err) => {
            setShowDeckBuilder(false);
            setShowLanding(true);
          });
        }}
        onBack={() => {
          setShowDeckBuilder(false);
          setShowLanding(true);
        }}
      />
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
    return <ResultScreen result={result} enemyName={enemy.name} bossRecap={gameState.bossRecap} onBackToMenu={() => setShowLanding(true)}/>;

  // --- Main game screen ---
  return (
    <GameBackground backgroundScene={scene}>
      {/* Settings pinned to top-right corner */}
      <div className="absolute" style={{ right: 20, top: 30 }}>
        <Settings saveButton={<SaveGameButton gameState={gameState} />} />
      </div>

      <div className="px-6 py-4 mx-auto w-350" data-tutorial-target="health">
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
      <div
        className="absolute"
        style={{ right: 400, bottom: 540 }}
        data-tutorial-target="enemy"
      >
        <EnemyDisplay enemy={enemy} isVisible={true} />
      </div>

      {/* End turn button — absolute to match its former flex-flow position */}
      <div
        className="absolute"
        style={{ top: 530, right: 30 }}
        data-tutorial-target="end-turn"
      >
        <EndTurnButton disabled={showTutorial} />
      </div>

      {/* Card hand row: DeckViewer on left, hand on right */}
      <div
        className="absolute flex items-end"
        style={{ left: 370, right: 140, bottom: 20 }}
        data-tutorial-target="hand"
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
        {/* Inner wrapper sized to DeckViewer's actual content, not the
            wide positioning container above — that container spans
            almost the full screen width and was causing the tutorial
            spotlight to highlight a huge, wrong area instead of the
            actual visible deck number. */}
        <div className="inline-block" data-tutorial-target="deck">
          <DeckViewer cards={deck} />
        </div>
      </div>

      {showTutorial && (
        <TutorialOverlay onClose={handleCloseTutorial} hand={hand} />
      )}
    </GameBackground>
  );
};