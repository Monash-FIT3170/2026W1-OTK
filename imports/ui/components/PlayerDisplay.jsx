import React, { useMemo } from 'react';
import { Player } from '../../engine/player/player';

export const PlayerDisplay = () => {
  const player = useMemo(() => new Player(0, 0), []);

  return (
    <div>
      <img
        src={player.getIdleSpritePath()}
        alt="Main player character"
        className="h-48 w-auto object-contain"
        style={{ imageRendering: 'pixelated' }}
        draggable={false}
      />
    </div>
  );
};
