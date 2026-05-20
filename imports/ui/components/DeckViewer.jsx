import React, { useEffect, useState } from 'react';
import Card from '../cards/Card';

export function DeckViewer({ cards }) {
  const [isOpen, setIsOpen] = useState(false); //This ensures that the View Deck button is only visible if it's not already currently open

  // There are two arrays which contain the Deck cards. One that has the original order
  // which is rawDeckCards, and deckCards takes the original array of cards and sorts it alphabetically.
  // This way the sort is not mutating the real deck array used in the game but just the array used
  // to visually display the Deck Viewer.
  const rawDeckCards = Array.isArray(cards)
    ? cards
    : Object.values(cards ?? {});
  const deckCards = [...rawDeckCards].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={{ fontFamily: '"Micro 5", monospace' }}
        className="bg-transparent border-0 p-0 cursor-pointer text-white text-[5.5rem] pointer-events-auto"
        onClick={() => setIsOpen(true)}
      >
        {rawDeckCards.length}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
          role="presentation"
          onClick={() => setIsOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="deck-viewer-title"
            className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-700 px-5 py-4">
              <div>
                <h2
                  id="deck-viewer-title"
                  className="text-lg font-bold text-white"
                >
                  Current Deck
                </h2>
                <p className="text-sm text-slate-300">
                  {deckCards.length} {deckCards.length === 1 ? 'card' : 'cards'}{' '}
                  remaining
                </p>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg text-sm transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5">
              {deckCards.length > 0 ? (
                <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 p-0">
                  {deckCards.map((card, index) => (
                    <li
                      key={card.uniqueId ?? `${card.cardId}-${index}`}
                      className="flex justify-center"
                    >
                      <Card cardProps={card} width={220} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-12 text-center text-slate-300">
                  Deck is empty.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
