import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../cards/Card';

const SMALL_CARD_WIDTH = 100;

function DeckBuilderHandCard({ card, onRemove }) {
  return (
    <motion.button
      key={card.uniqueId}
      type="button"
      layout
      onClick={() => onRemove(card.uniqueId)}
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
      className="
        group flex w-full items-center rounded-lg
        border border-slate-700 bg-slate-900
        p-2 text-left
        hover:border-red-400 hover:bg-slate-800
      "
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
  );
}

export default DeckBuilderHandCard;