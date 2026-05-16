import React from 'react';

export function GameBackground({backgroundScene, children}){
  return(
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(/assets/environments/${backgroundScene}-background.png)`,
        imageRendering: 'pixelated',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover'
      }}
    >
      {children}
    </div>
  )
}