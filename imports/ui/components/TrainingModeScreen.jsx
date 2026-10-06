import React, { useRef, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { GameBackground } from './GameBackground';
import { HealthBar } from './enemy/HealthBar';
import { PlayerDisplay } from './PlayerDisplay';
import { EnemyDisplay } from './enemy/EnemyDisplay';
import { DeckViewer } from './DeckViewer';
import { DraggableCard } from '../cards/DraggableCard';
import { SelectionPanel } from '../cards/SelectionPanel';
import { useTrainingEngine } from '../hooks/useTrainingEngine';

// Training Mode: free play against the Training Dummy using the player's
// own real saved deck. Everything here runs against a local, ephemeral
// GameEngine instance from useTrainingEngine — never Meteor.call, never
// UserDataCollection — so nothing about a training session can touch or
// overwrite the player's real save. Exiting always just returns to the
// landing page; there is no win/loss condition to reach.
export const TrainingModeScreen = ({
  savedDeck,
  personalBest = 0,
  onExit,
  _useTrainingEngine = useTrainingEngine,
}) => {
  const {
    hand,
    deck,
    enemy,
    totalDamageDealt,
    currentCycleDamage,
    bestCycleDamage,
    lastCycleDamage,
    restartCycle,
    deckRefillCount,
    pendingSelection,
    playCard,
    confirmSelection,
  } = _useTrainingEngine(savedDeck);

  const isNewPersonalBest = totalDamageDealt > personalBest;

  const handleExit = () => {
    // Fire-and-forget: a training score is a nice-to-have record, not
    // something worth blocking or re-prompting the player over if the
    // save fails, so this doesn't wait on the callback before leaving.
    if (totalDamageDealt > 0) {
      Meteor.call('userData.saveTrainingHighScore', totalDamageDealt, (err) => {
        if (err) console.error('userData.saveTrainingHighScore failed:', err);
      });
    }
    onExit();
  };

  const [selectedTargets, setSelectedTargets] = useState([]);
  const handRef = useRef(null);

  const visibleHand = hand.filter(
    (c) =>
      !selectedTargets.some((s) => s.uniqueId === c.uniqueId) &&
      c.uniqueId !== pendingSelection?.uniqueCardId
  );

  const inSelectionMode = pendingSelection !== null;
  const canAfford = (card) => card.currentCost <= deck.length;

  const onHandCardClick = (card) => {
    if (!pendingSelection) return;
    const { max: rawMax } = pendingSelection.cardAmountToSelect;
    const max = Math.min(rawMax, visibleHand.length + selectedTargets.length);
    const alreadySelected = selectedTargets.some(
      (c) => c.uniqueId === card.uniqueId
    );
    if (alreadySelected) {
      setSelectedTargets((prev) =>
        prev.filter((c) => c.uniqueId !== card.uniqueId)
      );
    } else if (selectedTargets.length < max) {
      setSelectedTargets((prev) => [...prev, card]);
    }
  };

  const onConfirm = () => {
    confirmSelection(selectedTargets.map((c) => c.uniqueId));
    setSelectedTargets([]);
  };

  return (
    <GameBackground backgroundScene="underpass-overlaid">
      <div className="absolute flex gap-3 z-[70]" style={{ right: 20, top: 30 }}>
        <button
          onClick={() => {
            restartCycle();
            setSelectedTargets([]);
          }}
          title="Start a fresh shuffled cycle. Keeps your session best and total damage."
          className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
        >
          Restart Cycle
        </button>
        <button
          onClick={handleExit}
          className="px-6 py-3 rounded-lg bg-red-700 hover:bg-red-600 text-white font-semibold transition-colors"
        >
          Exit Training
        </button>
      </div>

      {/* Cycle records are local to this session; the saved personal best
          remains the cumulative session total. */}
      <div
        className="absolute flex flex-col items-start gap-1 rounded-lg bg-slate-900/70 px-4 py-3"
        style={{ left: 20, top: 30 }}
      >
        <p className="text-slate-300 text-xs uppercase tracking-wide">
          Cycle {deckRefillCount + 1} damage
        </p>
        <p className="text-white text-3xl font-bold leading-none">
          {currentCycleDamage}
        </p>
        <p className="text-emerald-400 text-sm font-semibold">
          Best cycle this session: {bestCycleDamage}
        </p>
        <p className="text-slate-300 text-sm">
          Last cycle damage: {lastCycleDamage ?? '—'}
        </p>
        <p className="text-slate-400 text-xs">
          Refilling or restarting begins a new cycle.
        </p>
        <p className="text-slate-300 text-sm mt-2">
          Session total: {totalDamageDealt}
        </p>
        {isNewPersonalBest ? (
          <p className="text-emerald-400 text-xs font-semibold">
            New session-total personal best!
          </p>
        ) : (
          <p className="text-slate-400 text-xs">
            Session-total personal best: {personalBest}
          </p>
        )}
      </div>

      <div className="px-6 py-4 mx-auto w-350">
        <p className="text-white text-2xl font-semibold mb-2 drop-shadow-lg">
          Training Mode
        </p>
        <HealthBar
          current={enemy.currentHealth}
          max={enemy.health}
          name={enemy.name}
        />
      </div>

      <div className="absolute" style={{ left: 400, bottom: 540 }}>
        <PlayerDisplay />
      </div>

      <div className="absolute" style={{ right: 400, bottom: 540 }}>
        <EnemyDisplay enemy={enemy} isVisible={true} />
      </div>

      {pendingSelection && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pb-90 pointer-events-none">
          <div className="pointer-events-auto">
            <SelectionPanel
              pendingSelection={pendingSelection}
              selectedTargets={selectedTargets}
              availableCount={visibleHand.length + selectedTargets.length}
              onDeselectCard={(card) => {
                setSelectedTargets((prev) =>
                  prev.filter((c) => c.uniqueId !== card.uniqueId)
                );
              }}
              onConfirm={onConfirm}
            />
          </div>
        </div>
      )}

      <div
        ref={handRef}
        className="absolute flex items-end gap-2"
        style={{ left: 370, right: 140, bottom: 20 }}
      >
        {[...visibleHand].reverse().map((card) => (
          <DraggableCard
            key={card.uniqueId}
            cardProps={card}
            marginLeft="0px"
            onClick={() => onHandCardClick(card)}
            handRef={handRef}
            onPlay={playCard}
            isInSelectionMode={inSelectionMode}
            affordable={canAfford(card)}
            playable={!card.isFrozen}
          />
        ))}
      </div>

      <div
        className="absolute pointer-events-none"
        style={{ left: 54, bottom: 162 }}
      >
        <div className="inline-block pointer-events-auto">
          <DeckViewer cards={deck} />
        </div>
      </div>
    </GameBackground>
  );
};

export default TrainingModeScreen;
