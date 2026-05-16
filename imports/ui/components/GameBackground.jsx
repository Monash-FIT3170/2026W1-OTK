import React from 'react';

export function GameBackground({backgroundScene, children}){
  return(
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${backgroundScene})`,
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