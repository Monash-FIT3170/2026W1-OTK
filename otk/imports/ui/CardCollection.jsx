import Card from './Card';
import { motion } from 'motion/react';

export default function CardCollection({cards}) {
    return (
        <div className='flex flex-row overflow-x-hidden overflow-y-hidden border rounded-xl p-5 bg-amber-100'>
            {Object.values(cards).map((card, idx) => (
                <div key={idx} className={idx !== 0 ? '-ml-10' : ''}>
                <Card cardProps={card} />
                </div>
            ))}
        </div>
    );
}
