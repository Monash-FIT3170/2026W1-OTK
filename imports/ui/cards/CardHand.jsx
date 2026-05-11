import { useRef } from 'react';
import Card from './Card';
import { usePlayCard } from '../hooks/usePlayCard';
import { motion } from 'framer-motion';
import { SelectionPanel } from './SelectionPanel';
import { SelectionHand } from 'imports/engine/card/SelectionHand';
import { useState } from 'react';
import { DraggableCard } from './DraggableCard';

export default function CardHand({ cards }) {
  const [cardHand, setCardHand] = useState(
      cards
  );
  const [selectionHand, setSelectionHand] = useState(null);
  const handRef = useRef(null);
  const cardArray = Object.values(cards);
  const numCards = cardArray.length;

  const cardWidth = 176;
  const containerWidth = window.innerWidth - 40;
  const marginLeft =
    numCards > 1
      ? -Math.max(0, (cardWidth * numCards - containerWidth) / (numCards - 1))
      : 0; 

  const { onPlay, pendingSelection, confirmSelection } = usePlayCard();

  const onHandCardClick = (card) => {
    let currentCardHand = Object.assign(Object.create(Object.getPrototypeOf(cardHand)), cardHand);
    if (card.cardAmountToSelect !== null) {
      let currentSelectionHand = selectionHand;
      if (!currentSelectionHand) {
        currentSelectionHand = new SelectionHand(card);
        currentCardHand.removeCard(card);
      }
      else{
        if (currentSelectionHand.selectedCard !== card) {
         if (currentSelectionHand.addSelection(card)){
            currentCardHand.removeCard(card);
          }
        }
      }
      
      setCardHand(currentCardHand);
      setSelectionHand(currentSelectionHand);
    }
  };

  return (
    <div
      ref={handRef}
      className="flex flex-row border rounded-xl p-5 bg-amber-50 min-h-70 w-full"
    >
      {selectionHand && <SelectionPanel selectionHand={selectionHand} setSelectionHand={setSelectionHand} cardHand={cardHand} setCardHand={setCardHand} />}
      <div className="flex flex-row justify-center w-full">
        {cardHand.cards.map((card, idx) => (
                    <DraggableCard
                      key={card.uniqueId}
                      cardProps={card}
                      marginLeft={idx !== 0 ? `${marginLeft}px` : '0px'}
                      onClick={() => onHandCardClick(card)}
                      handRef={handRef} 
                      onPlay={onPlay}
                    />
                  ))}
      </div>
    </div>
  );
}
