import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { tutorialSteps } from '../tutorial/tutorialSteps';
import {
  measureTarget,
  computeHighlightStyle,
  computeCardPositionStyle,
} from '../tutorial/spotlight';

// Step-by-step tutorial walkthrough, shown automatically over the
// player's real first game. Mostly read-only (Back/Next/Skip/Done), with
// one exception: the "Your Hand" step is gated on the player actually
// playing a real card, using the live `hand` prop from App.jsx's real
// gameState. End Turn deliberately stays description-only here (never
// gated) — forcing a genuine End Turn press during onboarding risks a
// first-time player accidentally losing their real first game before
// they've dealt any damage. The manually-opened, fully sandboxed version
// (TutorialDemoScreen.jsx) follows the same rule for consistency, even
// though gating End Turn there would be harmless.
export const TutorialOverlay = ({ onClose, hand = [] }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState(null);

  const step = tutorialSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === tutorialSteps.length - 1;
  const isWaitingForAction = step.action === 'play-card';

  // Baseline of the hand's uniqueIds captured whenever we enter the
  // "Your Hand" step. Hand size briefly grows before it shrinks (drawing
  // cost cards happens before the played card is removed), so we can't
  // just watch hand.length — instead we watch for any baseline id
  // actually disappearing, which only happens once a card is genuinely
  // executed and removed.
  const handBaselineIdsRef = useRef(new Set());

  useEffect(() => {
    if (step.action === 'play-card') {
      handBaselineIdsRef.current = new Set(hand.map((c) => c.uniqueId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  useEffect(() => {
    if (step.action !== 'play-card') return;
    const currentIds = new Set(hand.map((c) => c.uniqueId));
    const cardWasPlayed = [...handBaselineIdsRef.current].some(
      (id) => !currentIds.has(id)
    );
    if (cardWasPlayed) {
      setStepIndex((i) => Math.min(i + 1, tutorialSteps.length - 1));
    }
  }, [hand, step.action]);

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
    if (isWaitingForAction) return; // this step only advances via the real action
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

  const cardContent = (
    <div className="bg-slate-800 rounded-xl shadow-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">
          Step {stepIndex + 1} of {tutorialSteps.length}
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

  // Rendered via a portal straight to document.body — App.jsx nests this
  // component inside GameBackground, which may sit under a CSS-scaled
  // ancestor (see GameScaleContext). A `transform` on any ancestor
  // silently changes what position: fixed is relative to, from the true
  // viewport to that ancestor's box — which is exactly what was causing
  // the spotlight to appear at the wrong size and position. Portaling
  // out of that tree entirely sidesteps the issue regardless of where
  // the scaling actually happens.
  if (!rect) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="w-full max-w-md mx-4">{cardContent}</div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <>
      <div style={computeHighlightStyle(rect)} />
      <div style={computeCardPositionStyle(rect, { pinToTop: step.target === 'hand' })}>
        {cardContent}
      </div>
    </>,
    document.body
  );
};

export default TutorialOverlay;