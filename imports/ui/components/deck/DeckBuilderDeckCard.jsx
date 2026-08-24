import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../cards/Card';

const LARGE_CARD_WIDTH = 220;

function DeckBuilderDeckCard({
  card,
  onSelect,
  copiesInDeck,
  maxCopiesPerCard,
  deckFull,
}) {
  const copies = copiesInDeck(card.cardId);

  const atCopyLimit = card.maxCopies != null && copies >= card.maxCopies;

  const disabled = atCopyLimit || deckFull;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(card)}
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
      <div
        className={
          'flex absolute left-5/9 -translate-x-1/2 flex items-center justify-center gap-4'
        }
      >
        {Array.from({ length: card.maxCopies }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 ${index < copies ? 'bg-slate-900' : 'bg-slate-500'} rounded-full flex items-center justify-center font-bold text-[8px]}`}
          />
        ))}
      </div>
    </motion.button>
  );
}

export default DeckBuilderDeckCard;
