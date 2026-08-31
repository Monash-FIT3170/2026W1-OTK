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
import { StageClearScreen } from './components/StageClearScreen';
import { SaveGameButton } from './components/SaveGameButton';
import { QuitToMenuButton } from './components/QuitToMenuButton';
import { LoginForm } from './auth/LoginForm';
import { AccountRegistrationForm } from './AccountRegistrationForm';
import { LandingPage } from './LandingPage';
import { TutorialOverlay } from './components/TutorialOverlay';
import { TutorialDemoScreen } from './components/TutorialDemoScreen';
import { DeckBuilder } from './components/deck/DeckBuilder';
import { buildAvailableCards } from './../engine/DeckBuilderCards';
import { DeckBuilder as DeckBuilderEngine } from '../engine/DeckBuilder';
import { FINAL_STAGE } from '../engine/stages';

import { useGameSounds } from './hooks/useGameSounds';
import Settings from './components/Settings';

export const App = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showTutorialDemo, setShowTutorialDemo] = useState(false);
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

  // Delayed result state to allow death/hit animations to finish playing before switching screens
  const [delayedResult, setDelayedResult] = useState(gameState?.result);

  useEffect(() => {
    const currentResult = gameState?.result;

    if (currentResult === 'stageCleared' || currentResult === 'win') {
      // 1.8-second delay before switching to StageClear/Result screens
      const timer = setTimeout(() => {
        setDelayedResult(currentResult);
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      setDelayedResult(currentResult);
    }
  }, [gameState?.result]);

  // If logged in but no game state exists yet, start a new game automatically
  useEffect(() => {
    if (!loading && user && !gameState && !showLanding) {
      Meteor.call('game.newGame', (err) => {
        if (err) console.error('game.newGame failed:', err);
      });
    }
  }, [loading, user, gameState, showLanding]);

  // Auto-show the tutorial every time the player starts a brand-new game
  useEffect(() => {
    if (!loading && user && gameState && !showLanding && justStartedNewGame) {
      setShowTutorial(true);
      setJustStartedNewGame(false);
    }
  }, [loading, user, gameState, showLanding, justStartedNewGame]);

  const onGameScreen =
    !loading && !!user && !showLanding && !showDeckBuilder && !showTutorialDemo;

  useGameSounds(gameState?.result, onGameScreen);

  const inBattle = onGameScreen && gameState?.result === 'playing';

  useEffect(() => {
    if (!inBattle) return;
    const id = setInterval(() => {
      Meteor.call('game.applyTimerTick', (err) => {
        if (err) console.error('game.applyTimerTick failed:', err);
      });
    }, 2000);
    return () => clearInterval(id);
  }, [inBattle]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    Meteor.call('user.markTutorialSeen', (err) => {
      if (err) console.error('user.markTutorialSeen failed:', err);
    });
  };

  const handleOpenTutorial = () => {
    setShowTutorialDemo(true);
  };

  const handleCloseTutorialDemo = () => {
    setShowTutorialDemo(false);
    Meteor.call('user.markTutorialSeen', (err) => {
      if (err) console.error('user.markTutorialSeen failed:', err);
    });
  };

  const handleStart = (isNewGame = false) => {
    setShowLanding(false);
    if (isNewGame) setJustStartedNewGame(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

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

  if (showTutorialDemo) {
    return <TutorialDemoScreen onClose={handleCloseTutorialDemo} />;
  }

  if (showLanding) {
    return (
      <LandingPage
        hasSave={
          gameState?.result === 'playing' ||
          gameState?.result === 'stageCleared'
        }
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
        initialDeck={
          userData?.nextDeck ??
          gameState?.baseDeck ??
          DeckBuilderEngine.buildStartingDeck() ??
          []
        }
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

  if (!gameState) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Starting game...</p>
      </div>
    );
  }

  const { hand, deck, enemy, scene, stage } = gameState;

  // --- Between stages: boss down (delayed screen switch) ---
  if (delayedResult === 'stageCleared') {
    return (
      <StageClearScreen
        stage={stage}
        enemyName={enemy.name}
        bossRecap={gameState.bossRecap}
        onBackToMenu={() => setShowLanding(true)}
      />
    );
  }

  // --- Victory / Defeat screens (delayed screen switch) ---
  if (delayedResult === 'win' || delayedResult === 'loss') {
    return (
      <ResultScreen
        result={delayedResult}
        enemyName={enemy.name}
        bossRecap={gameState.bossRecap}
        onBackToMenu={() => setShowLanding(true)}
      />
    );
  }

  // --- Main game screen ---
  return (
    <GameBackground backgroundScene={scene}>
      <div className="absolute" style={{ right: 20, top: 30 }}>
        <Settings
          saveButton={<SaveGameButton gameState={gameState} />}
          quitButton={<QuitToMenuButton onQuit={() => setShowLanding(true)} />}
        />
      </div>

      <div className="px-6 py-4 mx-auto w-350" data-tutorial-target="health">
        <p className="text-white text-2xl font-semibold mb-2 drop-shadow-lg">
          Stage {stage} / {FINAL_STAGE}
        </p>
        <HealthBar
          current={enemy.currentHealth}
          max={enemy.health}
          name={enemy.name}
        />
      </div>

      <div className="absolute " style={{ left: 400, bottom: 540 }}>
        <PlayerDisplay />
      </div>

      <div
        className="absolute"
        style={{ right: 400, bottom: 540 }}
        data-tutorial-target="enemy"
      >
        <EnemyDisplay enemy={enemy} isVisible={true} />
      </div>

      <div
        className="absolute"
        style={{ top: 530, right: 30 }}
        data-tutorial-target="end-turn"
      >
        <EndTurnButton disabled={showTutorial} />
      </div>

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