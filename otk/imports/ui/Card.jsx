export default function Card(cardProps) {
  return (
    <div>
      <div className="display-flex flex-direction-column flex">
        <div>
          <div>{cardProps.currentAttack}</div>
          <div>{cardProps.cost}</div>
        </div>
      </div>

      {cardProps.getName()}
    </div>
  );
}
