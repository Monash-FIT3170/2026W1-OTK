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

  const atCopyLimit =
    maxCopiesPerCard != null &&
    copies >= maxCopiesPerCard;

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
      <Card
        cardProps={card}
        width={LARGE_CARD_WIDTH}
      />
      
    </motion.button>
  );
}

export default DeckBuilderDeckCard;