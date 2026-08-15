import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../cards/Card';

const LARGE_CARD_WIDTH = 220;
const SMALL_CARD_WIDTH = 100;

let instanceCounter = 0;
function nextUniqueId(cardId) {
  instanceCounter += 1;
  return `${cardId}-deck-${instanceCounter}`;
}

export function DeckBuilder({
  availableCards = [],
  initialDeck = [],
  deckSize: maxDeckSize = 20,
  maxCopiesPerCard = 3,
  onConfirm,
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
          <div className="border-b border-slate-700 px-6 py-4">
            <h2 className="text-3xl">Your Deck</h2>

            <p className="text-lg text-slate-400">
              {deckCards.length} / {maxDeckSize} cards
            </p>
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
                    <motion.button
                      key={card.uniqueId}
                      type="button"
                      layout
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: 24,
                        transition: { duration: 0.15 },
                      }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => removeCardFromDeck(card.uniqueId)}
                      className="group flex w-full items-center rounded-lg
                        border border-slate-700 bg-slate-900
                        p-2 text-left
                        hover:border-red-400 hover:bg-slate-800"
                    >
                      <div className="shrink-0">
                        <Card cardProps={card} width={SMALL_CARD_WIDTH} />
                      </div>

                      <div className="ml-4 min-w-0">
                        <p className="truncate text-2xl text-white">
                          {card.name}
                        </p>

                        <p className="text-lg text-slate-400">
                          Cost: {card.currentCost}
                        </p>

                        <p className="text-lg text-slate-400">
                          Attack: {card.currentAttack}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* confirm button */}
          <div className="border-t border-slate-700 p-5">
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
                bg-white px-6 py-3
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
                {availableCards.map((card) => {
                  const copies = copiesInDeck(card.cardId);
                  const atCopyLimit =
                    maxCopiesPerCard != null && copies >= maxCopiesPerCard;
                  const deckFull = deckCards.length >= maxDeckSize;
                  const disabled = atCopyLimit || deckFull;

                  return (
                    <motion.button
                      key={card.cardId}
                      type="button"
                      onClick={() => addCardToDeck(card)}
                      disabled={disabled}
                      title={atCopyLimit ? 'Copy limit reached' : 'Add to deck'}
                      whileHover={
                        disabled
                          ? {}
                          : {
                              scale: 1.05,
                              boxShadow: '0 0 0 4px rgba(255,255,255,0.5)',
                            }
                      }
                      whileTap={disabled ? {} : { scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className={`
                        relative rounded-xl
                        focus:outline-none
                        ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}
                      `}
                    >
                      <Card cardProps={card} width={LARGE_CARD_WIDTH} />
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckBuilder;
