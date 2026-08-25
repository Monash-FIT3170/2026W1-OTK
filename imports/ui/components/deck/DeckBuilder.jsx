import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Card from '../../cards/Card';
import DeckBuilderHandCard from './DeckBuilderHandCard'
import DeckBuilderDeckCard from './DeckBuilderDeckCard';

let instanceCounter = 0;
function nextUniqueId(cardId) {
  instanceCounter += 1;
  return `${cardId}-deck-${instanceCounter}`;
}

export function DeckBuilder({
  availableCards = [],
  initialDeck = [],
  deckSize: maxDeckSize = 15,
  maxCopiesPerCard = 2,
  onConfirm,
  onBack,
}) {
  const [deckCards, setDeckCards] = useState(() =>
    initialDeck.map((card) => ({
      ...card,
      uniqueId: card.uniqueId ?? nextUniqueId(card.cardId),
    }))
  );

  const copiesInDeck = (cardId) =>
    deckCards.filter((deckCard) => deckCard.cardId === cardId).length;

  const addCardToDeck = (card) => {
    if (deckCards.length >= maxDeckSize) return;
    if (
      maxCopiesPerCard != null &&
      copiesInDeck(card.cardId) >= maxCopiesPerCard
    )
      return;

    setDeckCards((currentDeck) => [
      ...currentDeck,
      { ...card, uniqueId: nextUniqueId(card.cardId) },
    ]);
  };

  const removeCardFromDeck = (uniqueId) => {
    setDeckCards((currentDeck) =>
      currentDeck.filter((deckCard) => deckCard.uniqueId !== uniqueId)
    );
  };

  const removeAllCardsFromDeck = () => {
    setDeckCards((currentDeck) => [])
  }

  const handleConfirm = () => {
    if (deckCards.length !== maxDeckSize) {
      return;
    }

    if (onConfirm) {
      onConfirm(deckCards);
    }
  };


  return (
    <div
      className="flex h-screen w-full flex-col bg-slate-950 text-white"
      style={{ fontFamily: '"Micro 5", monospace' }}
    >
      <div className="flex items-center justify-between border-b border-slate-700 px-8 py-5">
        <div>
          <h1 className="text-4xl">Deck Builder</h1>

          <p className="text-xl text-slate-300">Select your cards</p>
        </div>

        <div className="text-3xl">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={deckCards.length}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                color: deckCards.length === maxDeckSize ? '#a3e635' : '#ffffff',
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'inline-block' }}
            >
              {deckCards.length}
            </motion.span>
          </AnimatePresence>

          <span className="text-slate-400"> / {maxDeckSize}</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* left panel for current selection */}
        <div className="flex w-[35%] min-w-[350px] flex-col border-r border-slate-700">
          <div className="border-b border-slate-700 px-6 py-4 flex">
            <div className="flex-4">
              <h2 className="text-3xl">Your Deck</h2>
              <p className="text-lg text-slate-400">
                {deckCards.length} / {maxDeckSize} cards
              </p>
            </div>

            <motion.button
              type="button"
              onClick={onBack}
              whileHover={
                {scale: 1.02}
              }
              whileTap={deckCards.length > 0}
              className="
                w-full rounded-lg
                flex-1
                bg-slate-700 px-6 my-2
                text-xl font-bold text-slate-900
                transition-colors
                hover:bg-slate-600
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              >
              Go Back
            </motion.button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {deckCards.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-xl text-slate-500">Your deck is empty.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {deckCards.map((card) => (
                    <DeckBuilderHandCard
                      key={card.uniqueId}
                      card={card}
                      onRemove={removeCardFromDeck}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* confirm button */}
          <div className="border-t border-slate-700 p-5 flex ">
            <motion.button
              type="button"
              disabled={deckCards.length !== maxDeckSize}
              onClick={handleConfirm}
              whileHover={
                deckCards.length === maxDeckSize ? { scale: 1.02 } : {}
              }
              whileTap={deckCards.length === maxDeckSize ? { scale: 0.97 } : {}}
              className="
                w-full rounded-lg
                flex-2
                bg-white px-6 py-3 mr-1
                text-xl font-bold text-slate-900
                transition-colors
                hover:bg-slate-200
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {deckCards.length === maxDeckSize
                ? 'Confirm Deck'
                : `Select ${maxDeckSize - deckCards.length} More`}
            </motion.button>
            <motion.button
              type="button"
              disabled={deckCards.length <= 0}
              onClick={removeAllCardsFromDeck}
              whileHover={
                {scale: 1.02}
              }
              whileTap={deckCards.length > 0}
              className="
                w-full rounded-lg
                flex-1
                bg-red-700 px-6 py-3
                text-xl font-bold text-slate-900
                transition-colors
                hover:bg-red-500
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Clear All
            </motion.button>
          </div>
        </div>

        {/* right panel for available cards */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-slate-700 px-6 py-4">
            <h2 className="text-3xl">Available Cards</h2>

            <p className="text-lg text-slate-400">
              Click a card to add a copy to your deck.
            </p>
          </div>

          {/* cards */}
          <div className="min-h-0 flex-1 overflow-y-auto p-8">
            {availableCards.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-xl text-slate-500">No cards available.</p>
              </div>
            ) : (
              <div
                className="
                grid
                grid-cols-[repeat(auto-fill,minmax(220px,1fr))]
                justify-items-center
                gap-8
              "
              >
                {availableCards.map((card) => (
                  <DeckBuilderDeckCard
                    key={card.cardId}
                    card={card}
                    onSelect={addCardToDeck}
                    copiesInDeck={copiesInDeck}
                    maxCopiesPerCard={maxCopiesPerCard}
                    deckFull={deckCards.length >= maxDeckSize}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckBuilder;
