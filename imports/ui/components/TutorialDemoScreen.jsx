import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { GameBackground } from './GameBackground';
import { HealthBar } from './enemy/HealthBar';
import { PlayerDisplay } from './PlayerDisplay';
import { EnemyDisplay } from './enemy/EnemyDisplay';
import { DeckViewer } from './DeckViewer';
import { DraggableCard } from '../cards/DraggableCard';
import { tutorialSteps } from '../tutorial/tutorialSteps';
import { useTutorialEngine } from '../hooks/useTutorialEngine';
import {
  measureTarget,
  computeHighlightStyle,
  computeCardPositionStyle,
} from '../tutorial/spotlight';

// The standalone demo shares the main tutorial steps, but finishes in a
// free-play state. Keeping this separate means the real-game overlay can
// retain its safer Done button instead of requiring the player's real turn
// to end.
const demoTutorialSteps = [
  ...tutorialSteps.slice(0, -1),
  {
    target: 'end-turn',
    action: 'end-turn',
    title: 'Keep Practising',
    description:
      'Keep playing cards against the Training Dummy for as long as you like. When you are ready to end the tutorial, press End Turn.',
  },
];

// The interactive tutorial: real gameplay actions (playing a card,
// ending your turn) run against a local, ephemeral GameEngine instance
// from useTutorialEngine — never Meteor.call, never UserDataCollection.
// Steps with an `action` requirement (see tutorialSteps.js) only advance
// once the player actually performs that action, not via a Next click.
export const TutorialDemoScreen = ({
  onClose,
  _useTutorialEngine = useTutorialEngine,
}) => {
  const { hand, deck, enemy, cardsPlayedCount, playCard, endTurn } =
    _useTutorialEngine();

  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const handRef = useRef(null);

  const step = demoTutorialSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === demoTutorialSteps.length - 1;
  const isWaitingForAction = Boolean(step.action);

  // Baseline captured whenever we enter a gated step, so we can tell
  // "the player just played a card" apart from "they already played one
  // earlier and went Back". Reset each time stepIndex changes. This baseline
  // only applies to the play-card action; the final end-turn action is handled
  // directly by handleEndTurn.
  const playBaselineRef = useRef(0);

  useEffect(() => {
    playBaselineRef.current = cardsPlayedCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  useEffect(() => {
    if (
      step.action === 'play-card' &&
      cardsPlayedCount > playBaselineRef.current
    ) {
      setStepIndex((i) => Math.min(i + 1, demoTutorialSteps.length - 1));
    }
  }, [cardsPlayedCount, step.action]);

  useEffect(() => {
    const measure = () => setRect(measureTarget(step.target));
    measure();
    const settleTimer = setTimeout(measure, 60);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(settleTimer);
    };
  }, [stepIndex, step.target]);

  const handleNext = () => {
    if (isWaitingForAction) return; // gated steps only advance via the real action
    if (isLastStep) {
      onClose();
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (isFirstStep) return;
    setStepIndex((i) => i - 1);
  };

  const handleEndTurn = () => {
    endTurn();
    if (step.action === 'end-turn') {
      onClose();
    }
  };

  const canAfford = (card) => card.currentCost <= deck.length;

  const cardContent = (
    <div className="bg-slate-800 rounded-xl shadow-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">
          Step {stepIndex + 1} of {demoTutorialSteps.length}
        </span>
        <button
          onClick={onClose}
          aria-label="Skip tutorial"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
        <p className="text-slate-200 leading-relaxed">{step.description}</p>
        {isWaitingForAction && (
          <p className="text-emerald-400 text-sm mt-3 font-semibold">
            Waiting for you to try it...
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleBack}
          disabled={isFirstStep}
          className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Back
        </button>

        {!isWaitingForAction && (
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
          >
            {isLastStep ? 'Done' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <GameBackground backgroundScene="underpass-overlaid">
      <div className="px-6 py-4 mx-auto w-350" data-tutorial-target="health">
        <HealthBar
          current={enemy.currentHealth}
          max={enemy.health}
          name={enemy.name}
        />
      </div>

      <div className="absolute" style={{ left: 400, bottom: 540 }}>
        <PlayerDisplay />
      </div>

      <div
        className="absolute"
        style={{ right: 400, bottom: 540 }}
        data-tutorial-target="enemy"
      >
        <EnemyDisplay enemy={enemy} isVisible={true} />
      </div>

      {/* Real, local End Turn — calls the hook's endTurn(), not the real
          game.endTurn Meteor method. */}
      <div
        className="absolute"
        style={{ top: 530, right: 30 }}
        data-tutorial-target="end-turn"
      >
        <button
          onClick={handleEndTurn}
          className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg text-xl transition-colors"
        >
          End Turn
        </button>
      </div>

      {/* Real, local, draggable hand — drag a card out to actually play it
          against the local engine, same gesture as the real game's
          DraggableCard. Card is rendered at its real-game default width
          (300) rather than a shrunk-down size, so this matches what the
          player will actually see in real gameplay. */}
      <div
        ref={handRef}
        className="absolute flex items-end gap-2"
        style={{ left: 370, right: 140, bottom: 20 }}
        data-tutorial-target="hand"
      >
        {hand.map((cardProps) => (
          <DraggableCard
            key={cardProps.uniqueId}
            cardProps={cardProps}
            marginLeft="0px"
            onClick={() => {}}
            handRef={handRef}
            onPlay={playCard}
            isInSelectionMode={false}
            affordable={canAfford(cardProps)}
            playable={!cardProps.isFrozen}
          />
        ))}
      </div>

      <div
        className="absolute flex items-end pointer-events-none"
        style={{ left: 87, right: 140, bottom: 163 }}
      >
        {/* Reuses the real DeckViewer component — it's purely local/
            presentational (no Meteor calls), so it's safe here and gives
            pixel-perfect consistency with the real game screen instead
            of a custom placeholder. Wrapped tightly so the tutorial
            spotlight highlights just the visible deck number, not the
            wide positioning container around it. */}
        <div
          className="inline-block pointer-events-auto"
          data-tutorial-target="deck"
        >
          <DeckViewer cards={deck} />
        </div>
      </div>

      {/* Portaled straight to document.body — see the matching comment in
          TutorialOverlay.jsx for why: rendering position: fixed elements
          inside GameBackground (a possibly CSS-scaled ancestor) makes
          them relative to that scaled box instead of the true viewport. */}
      {!rect
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="w-full max-w-md mx-4">{cardContent}</div>
            </div>,
            document.body
          )
        : createPortal(
            <>
              <div style={computeHighlightStyle(rect)} />
              <div
                style={computeCardPositionStyle(rect, {
                  pinToTop:
                    step.target === 'hand' || step.action === 'end-turn',
                })}
              >
                {cardContent}
              </div>
            </>,
            document.body
          )}
    </GameBackground>
  );
};

export default TutorialDemoScreen;
