import React, { useState } from 'react';
import { tutorialSteps } from '../tutorial/tutorialSteps';

// Step-by-step tutorial walkthrough, shown as a modal overlay.
// Used both for the automatic first-time-user experience and as a
// manually-triggered option (e.g. a "Tutorial" button on the landing page).
//
// This is the easier implementation: static descriptive steps rather
// than live-positioned highlights over real game elements. The step data
// model here is written so that a future, more visual version could reuse
// the same tutorialSteps content.
export const TutorialOverlay = ({ onClose }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const step = tutorialSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === tutorialSteps.length - 1;

  const handleNext = () => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-5">
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
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleBack}
            disabled={isFirstStep}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
          >
            {isLastStep ? 'Done' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;