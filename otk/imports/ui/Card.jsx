import React from 'react';
import { motion } from "motion/react";

export default function Card({cardProps}) {
  return (
    <motion.div >
      <motion.div whileHover={{scale: 1.2, backgroundColor: "oklch(58.5% 0.233 277.117)"}} 
      className="flex flex-col gap-3 bg-white rounded-xl shadow-md p-2 aspect-5/7 max-w-60 box-border border-1">
        <div className="flex flex-1 justify-center box-border border-1">
          {cardProps.name}
        </div>
        <div className="flex flex-4 flex-row gap-3">
          <div className="flex flex-1 flex flex-col">
              <div className="flex box-border border-1 aspect-square bg-blue-500 rounded-xl justify-center-safe">
                {cardProps.currentCost}
              </div>
              <div className="flex box-border border-1 aspect-square bg-red-500 rounded-xl justify-center-safe">
                {cardProps.currentAttack}
              </div>
          </div>
          <div className="flex flex-5"> 
            <img src="https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da842ea3aa5c5df70433b0b5146f" className="flex"/>
            {/* TODO - Placeholder image */}
          </div>
        </div>
        <div className="flex flex-5 min-h-30 box-border border-1">
          {cardProps.description}
        </div>
      </motion.div>

      {/* {cardProps.getName()} */}
    </motion.div>
  );
};
