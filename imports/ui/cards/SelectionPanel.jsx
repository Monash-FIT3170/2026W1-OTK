import Card from './Card';

export function SelectionPanel({
  pendingSelection,
  selectedTargets,
  availableCount,
  onDeselectCard,
  onConfirm,
}) {
  const { min: rawMin, max: rawMax } = pendingSelection.cardAmountToSelect;
  const max = Math.min(rawMax, availableCount);
  const min = Math.min(rawMin, availableCount);
  const playedCard = pendingSelection.card;
  const numCards = selectedTargets.length;

  const cardWidth = 176;
  const containerWidth = (window.innerWidth * 8) / 10 - 40;
  const marginLeft =
    numCards > 1
      ? -Math.max(0, (cardWidth * numCards - containerWidth) / (numCards - 1))
      : 0;

  const isValidSelection = numCards >= min && numCards <= max;

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col justify-center w-1/2">
        <p className="flex justify-center mb-1">Select cards</p>
        <div className="flex flex-row">
          <div className="flex min-h-70 justify-center p-5 w-4/10">
            <Card cardProps={playedCard} />
          </div>
          <div className="flex flex-row justify-center overflow-x-hidden overflow-y-hidden border rounded-xl p-5 bg-gray-70 w-8/10">
            {selectedTargets.map((card, idx) => (
              <div key={card.uniqueId} onClick={() => onDeselectCard(card)}>
                <Card
                  style={{ marginLeft: idx !== 0 ? `${marginLeft}px` : '0px' }}
                  cardProps={card}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row justify-center m-2">
          <div className="flex mt-1">
            <p>
              Select {min === max ? min : `${min} to ${max}`} card
              {max !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex ml-5">
            <button
              type="button"
              className="text-body bg-neutral-secondary-medium box-border border border-default-medium 
            hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium 
            leading-5 rounded-full text-sm px-4 py-1.5 focus:outline-none disabled:bg-gray-400"
              disabled={!isValidSelection}
              onClick={onConfirm}
            >
              ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
