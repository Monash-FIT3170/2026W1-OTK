import React from 'react';

/**
 * Displays the background for the game updating with the game stage.
 * The image used must be named in the format: [background name]-enemy.png and placed in the /assets/environments/ directory.
 * For example, an Underpass background would require an image named underpass-background.png
 *
 * @component
 * @param {string} backgroundScene - the name of the scene representing the background
 */
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