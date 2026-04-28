export default function Card(cardProps) {
  return (
    <div>
      <div className="flex flex-col gap-3 bg-white rounded-xl shadow-md p-6">
        <div className="flex-1">
          {cardProps.name}
        </div>
        <div className="flex-4 flex-row">
          <div className="flex-1 flex-col">
              <div className="flex">
                {cardProps.currentCost}
              </div>
              <div className="flex">
                {cardProps.currentAttack}
              </div>
          </div>
          <div className="flex-5"> 
            /** TODO - Placeholder image */
          </div>
        </div>
        <div className="flex-5">
          {cardProps.description}
        </div>
      </div>

      {cardProps.getName()}
    </div>
  );
}
