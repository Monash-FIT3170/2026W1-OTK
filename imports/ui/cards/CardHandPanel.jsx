import { Card } from './Card';
import { motion } from 'framer-motion';
import { SelectionPanel } from './SelectionPanel';
import { SelectionHand } from 'imports/engine/card/SelectionHand';
import { useState } from 'react';
import { DraggableCard } from './DraggableCard';

export function CardHandPanel({ cardHand, setCardHand }) {
  const numCards = cardHand.cards.length;
  

  
    
  

  return (
    <div>
      
      <div className="flex flex-row border rounded-xl p-5 bg-amber-50 min-h-70 w-full">
        <div className="flex flex-row justify-center w-full">
          {cardHand.cards.map((card, idx) => (
            <DraggableCard
              key={card.id}
              card={card}
              marginLeft={idx !== 0 ? `${marginLeft}px` : '0px'}
              onClick={() => onHandCardClick(card)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
