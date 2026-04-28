import Card from './Card';

export default function CardCollection(cards) {
    return (
        <div className='flex flex-wrap'>
            {cards.map((card) => (
                <Card
            ))}
        </div>
    
    )
}
