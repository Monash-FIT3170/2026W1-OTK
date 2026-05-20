import Card from './Card';

const CARD_WIDTH = 255;

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

  const isValidSelection =
    selectedTargets.length >= min && selectedTargets.length <= max;

  return (
    <div className="flex flex-row gap-0 items-center justify-center w-full h-full">
      {/* Left: played card, fixed position */}

      <Card cardProps={playedCard} width={CARD_WIDTH} />

      {/* Right: selection slots + confirm */}
      <div className="flex flex-col items-center justify-center gap-4 pl-6">
        <p className="text-led text-sm">
          Select {min === max ? min : `${min}–${max}`} card
          {max !== 1 ? 's' : ''}
        </p>
        <div className="flex flex-row gap-4">
          {Array.from({ length: max }).map((_, idx) => {
            const card = selectedTargets[idx];
            return (
              <div
                key={card?.uniqueId ?? idx}
                className="relative inline-block"
              >
                {/* Invisible card establishes the natural slot size */}
                <div className="invisible">
                  <Card cardProps={playedCard} width={CARD_WIDTH} />
                </div>
                {/* Overlay: card on top, or empty slot styling */}
                {card ? (
                  <div
                    className="absolute inset-0 cursor-pointer overflow-hidden"
                    onClick={() => onDeselectCard(card)}
                  >
                    <Card cardProps={card} width={CARD_WIDTH} />
                  </div>
                ) : (
                  <div className="absolute inset-0 rounded-xl border-2 border-dashed border-led bg-led/20" />
                )}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="bg-white text-led hover:bg-gray-100
            focus:ring-4 focus:ring-gray-300 font-semibold rounded-full text-sm
            px-6 py-2 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!isValidSelection}
          onClick={onConfirm}
        >
          ok
        </button>
      </div>
    </div>
  );
}
