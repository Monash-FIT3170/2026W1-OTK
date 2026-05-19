import React from 'react';

function Card({ cardProps, scale = 1 }) {
  const costFontColour =
    cardProps.currentCost != cardProps.baseCost
      ? 'text-lime-400'
      : 'text-white';
  const attackFontColour =
    cardProps.currentAttack != cardProps.baseAttack
      ? 'text-lime-400'
      : 'text-red-400';
  return (
    <div style={{ zoom: scale, display: 'inline-block' }}>
      <div
        style={{ fontFamily: '"Micro 5", monospace' }}
        className="relative inline-block"
      >
        <img
          draggable={false}
          src={`/assets/sprites/cards/${cardProps.cardId}.png`}
          alt={cardProps.name}
          width={300}
          onError={(e) => {
            e.target.src = '/assets/sprites/cards/placeholder-card.png';
          }}
        />

        {/*Cost + Attack*/}
        <div className={`absolute top-8 left-11.5 -translate-x-1/2 text-[2.4rem] ${costFontColour}`}>
          {cardProps.currentCost}
        </div>
        <div className={`absolute top-30 left-11.5 -translate-x-1/2 text-[2.4rem] ${attackFontColour}`}>
          {cardProps.currentAttack}
        </div>
        {/*Name*/}
        <div className="absolute top-4 left-12 right-2 text-center text-[2.2rem] text-white">
          {cardProps.name}
        </div>
        {/*Description*/}
        <div className="absolute top-66 left-20 right-10 text-center text-[1.7rem] text-white leading-none">
          {cardProps.description}
        </div>
      </div>
    </div>
  );
}

export default Card;

// import React from 'react';
// import { motion } from 'motion/react';

// const CARD_WIDTH = 160;
// const CARD_HEIGHT = 224;

// function Card({ cardProps, isDragging = false }) {
//   const costFontColour =
//     cardProps.currentCost != cardProps.baseCost
//       ? 'text-lime-700'
//       : 'text-blue-700';
//   const attackFontColour =
//     cardProps.currentAttack != cardProps.baseAttack
//       ? 'text-lime-700'
//       : 'text-red-700';

//   const hoverAnimation = isDragging
//     ? {}
//     : { scale: 1.1, backgroundColor: 'oklch(90.5% 0.233 277.117)' };

//   return (
//     <motion.div className="flex justify-center">
//       <motion.div
//         whileHover={hoverAnimation}
//         style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
//         className="flex flex-col gap-2 bg-slate-400 rounded-xl shadow-md p-2 box-border border-slate-600 border-1"
//       >
//         <div
//           className="flex flex-2/12 min-h-5 justify-center box-border border-1 bg-slate-300 box-border border-slate-600 border-1 font-mono
//         font-semibold tracking-wide text-ellipsis overflow-y-clip min-w-0"
//         >
//           {cardProps.name}
//         </div>
//         <div className="flex flex-4/10 flex-row gap-3 grow-0">
//           <div className="flex flex-1/6 flex flex-col gap-0.5 grow-0 min-w-0">
//             <div className="flex box-border border-1 border-blue-800 aspect-square bg-blue-300 rounded-xl justify-center-safe font-mono text-ellipsis">
//               <p className={costFontColour}>{cardProps.currentCost} </p>
//             </div>
//             {cardProps.currentAttack !== undefined && (
//               <div className="flex box-border border-1 border-red-800 aspect-square bg-red-300 rounded-xl justify-center-safe font-mono text-ellipsis">
//                 <p className={attackFontColour}>{cardProps.currentAttack}</p>
//               </div>
//             )}
//           </div>
//           <div className="flex flex-1/6 box-border border-slate-600 border-1 aspect-5/4">
//             <img
//               draggable={false}
//               src="https://assetsio.gnwcdn.com/pokemon-tcg-25th-anniversary-pikachu-base-set-artwork.png?width=690&quality=85&format=jpg&dpr=3&auto=webp"
//             />
//             {/* TODO - Placeholder image */}
//           </div>
//         </div>
//         <div
//           className="flex flex-7/10 min-h-20 box-border border-1 bg-slate-300 box-border border-slate-600 border-1 font-mono
//         tracking-tighter text-ellipsis overflow-y-clip text-sm grow-3"
//         >
//           <p className="ml-1 mt-1">{cardProps.description}</p>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// export default Card;
